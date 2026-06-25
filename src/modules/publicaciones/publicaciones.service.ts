import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';
import { Model, Types } from 'mongoose';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { SearchPublicacionDto } from './dto/search-publicacion.dto';
import { User, UserDocument } from '../usuarios/schemas/user.schema';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreatePublicacionDto) {
    await this.ensureUserExists(dto.usuario_id);

    const publicacion = await this.publicacionModel.create(dto);
    return ResponseHelper.success(publicacion, 201);
  }

  async findAll(search: SearchPublicacionDto = {}) {
    const filter: any = { activo: true };

    if (search.contenido) {
      filter.contenido = {
        $regex: search.contenido,
        $options: 'i',
      };
    }

    if (search.usuario_id) {
      this.validateObjectId(search.usuario_id, 'Usuario no valido');
      filter.usuario_id = search.usuario_id;
    }

    const page = Number(search.page) || 1;
    const limit = Number(search.limit) || 10;

    const publicaciones = await this.publicacionModel
      .find(filter)
      .populate('usuario_id')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.publicacionModel.countDocuments(filter);

    return ResponseHelper.success({ total, page, limit, data: publicaciones });
  }

  async findInactive() {
    const publicaciones = await this.publicacionModel
      .find({ activo: false })
      .populate('usuario_id');

    return ResponseHelper.success(publicaciones);
  }

  async findOne(id: string) {
    this.validateObjectId(id, 'Publicacion no valida');

    const publicacion = await this.publicacionModel
      .findById(id)
      .populate('usuario_id');

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    return ResponseHelper.success(publicacion);
  }

  async update(id: string, dto: UpdatePublicacionDto) {
    this.validateObjectId(id, 'Publicacion no valida');

    const publicacion = await this.publicacionModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    if (dto.usuario_id) {
      await this.ensureUserExists(dto.usuario_id);
    }

    const updatedPublicacion = await this.publicacionModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );

    return ResponseHelper.success(updatedPublicacion);
  }

  async partialUpdate(id: string, dto: UpdatePublicacionDto) {
    this.validateObjectId(id, 'Publicacion no valida');

    const publicacion = await this.publicacionModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    if (dto.usuario_id) {
      await this.ensureUserExists(dto.usuario_id);
    }

    const updatedPublicacion = await this.publicacionModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    return ResponseHelper.success(updatedPublicacion);
  }

  async remove(id: string) {
    this.validateObjectId(id, 'Publicacion no valida');

    const publicacion = await this.publicacionModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    const deletedPublicacion = await this.publicacionModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    return ResponseHelper.success(deletedPublicacion);
  }

  async restore(id: string) {
    this.validateObjectId(id, 'Publicacion no valida');

    const publicacion = await this.publicacionModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    const restoredPublicacion = await this.publicacionModel.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true },
    );

    return ResponseHelper.success(restoredPublicacion);
  }

  private validateObjectId(id: string, message: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(message);
    }
  }

  private async ensureUserExists(id: string) {
    this.validateObjectId(id, 'Usuario no valido');

    const user = await this.userModel.findOne({
      _id: id,
      activo: true,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado o inactivo');
    }
  }
}
