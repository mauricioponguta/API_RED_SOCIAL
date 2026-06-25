import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/response.helper';
import {
  Publicacion,
  PublicacionDocument,
} from '../publicaciones/schemas/publicacion.schema';
import { User, UserDocument } from '../usuarios/schemas/user.schema';
import { CreateReaccionDto } from './dto/create-reaccion.dto';
import { SearchReaccionDto } from './dto/search-reaccion.dto';
import { UpdateReaccionDto } from './dto/update-reaccion.dto';
import { Reaccion, ReaccionDocument } from './schemas/reaccion.schema';

@Injectable()
export class ReaccionesService {
  constructor(
    @InjectModel(Reaccion.name)
    private readonly reaccionModel: Model<ReaccionDocument>,

    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateReaccionDto) {
    await this.ensureUserExists(dto.usuario_id);
    await this.ensurePublicacionExists(dto.publicacion_id);

    const reaccion = await this.reaccionModel.create(dto);
    return ResponseHelper.success(reaccion, 201);
  }

  async findAll(search: SearchReaccionDto = {}) {
    const filter: any = { activo: true };

    if (search.publicacion_id) {
      this.validateObjectId(search.publicacion_id, 'Publicacion no valida');
      filter.publicacion_id = search.publicacion_id;
    }

    if (search.usuario_id) {
      this.validateObjectId(search.usuario_id, 'Usuario no valido');
      filter.usuario_id = search.usuario_id;
    }

    if (search.tipo_reaccion) {
      filter.tipo_reaccion = search.tipo_reaccion;
    }

    const page = Number(search.page) || 1;
    const limit = Number(search.limit) || 10;

    const reacciones = await this.reaccionModel
      .find(filter)
      .populate('publicacion_id')
      .populate('usuario_id')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.reaccionModel.countDocuments(filter);

    return ResponseHelper.success({ total, page, limit, data: reacciones });
  }

  async findInactive() {
    const reacciones = await this.reaccionModel
      .find({ activo: false })
      .populate('publicacion_id')
      .populate('usuario_id');

    return ResponseHelper.success(reacciones);
  }

  async findOne(id: string) {
    this.validateObjectId(id, 'Reaccion no valida');

    const reaccion = await this.reaccionModel
      .findById(id)
      .populate('publicacion_id')
      .populate('usuario_id');

    if (!reaccion) {
      throw new NotFoundException('Reaccion no encontrada');
    }

    return ResponseHelper.success(reaccion);
  }

  async update(id: string, dto: UpdateReaccionDto) {
    this.validateObjectId(id, 'Reaccion no valida');

    const reaccion = await this.reaccionModel.findById(id);

    if (!reaccion) {
      throw new NotFoundException('Reaccion no encontrada');
    }

    if (dto.usuario_id) {
      await this.ensureUserExists(dto.usuario_id);
    }

    if (dto.publicacion_id) {
      await this.ensurePublicacionExists(dto.publicacion_id);
    }

    const updatedReaccion = await this.reaccionModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    );

    return ResponseHelper.success(updatedReaccion);
  }

  async partialUpdate(id: string, dto: UpdateReaccionDto) {
    this.validateObjectId(id, 'Reaccion no valida');

    const reaccion = await this.reaccionModel.findById(id);

    if (!reaccion) {
      throw new NotFoundException('Reaccion no encontrada');
    }

    if (dto.usuario_id) {
      await this.ensureUserExists(dto.usuario_id);
    }

    if (dto.publicacion_id) {
      await this.ensurePublicacionExists(dto.publicacion_id);
    }

    const updatedReaccion = await this.reaccionModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    return ResponseHelper.success(updatedReaccion);
  }

  async remove(id: string) {
    this.validateObjectId(id, 'Reaccion no valida');

    const reaccion = await this.reaccionModel.findById(id);

    if (!reaccion) {
      throw new NotFoundException('Reaccion no encontrada');
    }

    const deletedReaccion = await this.reaccionModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    return ResponseHelper.success(deletedReaccion);
  }

  async restore(id: string) {
    this.validateObjectId(id, 'Reaccion no valida');

    const reaccion = await this.reaccionModel.findById(id);

    if (!reaccion) {
      throw new NotFoundException('Reaccion no encontrada');
    }

    const restoredReaccion = await this.reaccionModel.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true },
    );

    return ResponseHelper.success(restoredReaccion);
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

  private async ensurePublicacionExists(id: string) {
    this.validateObjectId(id, 'Publicacion no valida');

    const publicacion = await this.publicacionModel.findOne({
      _id: id,
      activo: true,
    });

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada o inactiva');
    }
  }
}
