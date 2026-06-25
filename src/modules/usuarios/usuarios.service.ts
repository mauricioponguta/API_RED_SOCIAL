import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, RoleDocument } from '../roles/schemas/roles.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(dto: CreateUserDto) {
    await this.ensureRoleExists(dto.rol_id);

    const exists = await this.userModel.findOne({ correo: dto.correo });

    if (exists) {
      throw new BadRequestException('Correo ya registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    return ResponseHelper.success(this.hidePassword(user), 201);
  }

  async findAll(search: SearchUserDto = {}) {
    const filter: any = { activo: true };

    if (search.nombre) {
      filter.nombre = {
        $regex: search.nombre,
        $options: 'i',
      };
    }

    if (search.correo) {
      filter.correo = {
        $regex: search.correo,
        $options: 'i',
      };
    }

    if (search.rol_id) {
      this.validateObjectId(search.rol_id, 'Rol no valido');
      filter.rol_id = search.rol_id;
    }

    const page = Number(search.page) || 1;
    const limit = Number(search.limit) || 10;

    const data = await this.userModel
      .find(filter)
      .select('-password')
      .populate('rol_id')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.userModel.countDocuments(filter);

    return ResponseHelper.success({ total, page, limit, data });
  }

  async findInactive() {
    const users = await this.userModel
      .find({ activo: false })
      .select('-password')
      .populate('rol_id');

    return ResponseHelper.success(users);
  }

  async findOne(id: string) {
    this.validateObjectId(id, 'Usuario no valido');

    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('rol_id');

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return ResponseHelper.success(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.saveUpdate(id, dto);
  }

  async partialUpdate(id: string, dto: UpdateUserDto) {
    return this.saveUpdate(id, dto, true);
  }

  async remove(id: string) {
    this.validateObjectId(id, 'Usuario no valido');

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const deletedUser = await this.userModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .select('-password');

    return ResponseHelper.success(deletedUser);
  }

  async restore(id: string) {
    this.validateObjectId(id, 'Usuario no valido');

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const restoredUser = await this.userModel
      .findByIdAndUpdate(id, { activo: true }, { new: true })
      .select('-password');

    return ResponseHelper.success(restoredUser);
  }

  private async saveUpdate(id: string, dto: UpdateUserDto, partial = false) {
    this.validateObjectId(id, 'Usuario no valido');

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.rol_id) {
      await this.ensureRoleExists(dto.rol_id);
    }

    if (dto.correo) {
      const exists = await this.userModel.findOne({
        _id: { $ne: id },
        correo: dto.correo,
      });

      if (exists) {
        throw new BadRequestException('Correo ya registrado');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const update = partial ? { $set: dto } : dto;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .select('-password')
      .populate('rol_id');

    return ResponseHelper.success(updatedUser);
  }

  private validateObjectId(id: string, message: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(message);
    }
  }

  private async ensureRoleExists(id: string) {
    this.validateObjectId(id, 'Rol no valido');

    const role = await this.roleModel.findOne({
      _id: id,
      activo: true,
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado o inactivo');
    }
  }

  private hidePassword(user: UserDocument) {
    const data = user.toObject();
    delete data.password;
    return data;
  }
}
