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
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { SearchComentarioDto } from './dto/search-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Comentario, ComentarioDocument } from './schemas/comentario.schema';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<ComentarioDocument>,

    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateComentarioDto) {
    await this.ensureUserExists(dto.usuario_id);
    await this.ensurePublicacionExists(dto.publicacion_id);

    const comentario = await this.comentarioModel.create(dto);
    return ResponseHelper.success(comentario, 201);
  }

  async findAll(search: SearchComentarioDto = {}) {
    const filter: any = { activo: true };

    if (search.comentario) {
      filter.comentario = {
        $regex: search.comentario,
        $options: 'i',
      };
    }

    if (search.publicacion_id) {
      this.validateObjectId(search.publicacion_id, 'Publicacion no valida');
      filter.publicacion_id = search.publicacion_id;
    }

    if (search.usuario_id) {
      this.validateObjectId(search.usuario_id, 'Usuario no valido');
      filter.usuario_id = search.usuario_id;
    }

    const page = Number(search.page) || 1;
    const limit = Number(search.limit) || 10;

    const comentarios = await this.comentarioModel
      .find(filter)
      .populate('publicacion_id')
      .populate('usuario_id')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.comentarioModel.countDocuments(filter);

    return ResponseHelper.success({ total, page, limit, data: comentarios });
  }

  async findInactive() {
    const comentarios = await this.comentarioModel
      .find({ activo: false })
      .populate('publicacion_id')
      .populate('usuario_id');

    return ResponseHelper.success(comentarios);
  }

  async findOne(id: string) {
    this.validateObjectId(id, 'Comentario no valido');

    const comentario = await this.comentarioModel
      .findById(id)
      .populate('publicacion_id')
      .populate('usuario_id');

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    return ResponseHelper.success(comentario);
  }

  async update(id: string, dto: UpdateComentarioDto) {
    this.validateObjectId(id, 'Comentario no valido');

    const comentario = await this.comentarioModel.findById(id);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (dto.usuario_id) {
      await this.ensureUserExists(dto.usuario_id);
    }

    if (dto.publicacion_id) {
      await this.ensurePublicacionExists(dto.publicacion_id);
    }

    const updatedComentario = await this.comentarioModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    );

    return ResponseHelper.success(updatedComentario);
  }

  async partialUpdate(id: string, dto: UpdateComentarioDto) {
    this.validateObjectId(id, 'Comentario no valido');

    const comentario = await this.comentarioModel.findById(id);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (dto.usuario_id) {
      await this.ensureUserExists(dto.usuario_id);
    }

    if (dto.publicacion_id) {
      await this.ensurePublicacionExists(dto.publicacion_id);
    }

    const updatedComentario = await this.comentarioModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    return ResponseHelper.success(updatedComentario);
  }

  async remove(id: string) {
    this.validateObjectId(id, 'Comentario no valido');

    const comentario = await this.comentarioModel.findById(id);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const deletedComentario = await this.comentarioModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    return ResponseHelper.success(deletedComentario);
  }

  async restore(id: string) {
    this.validateObjectId(id, 'Comentario no valido');

    const comentario = await this.comentarioModel.findById(id);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const restoredComentario = await this.comentarioModel.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true },
    );

    return ResponseHelper.success(restoredComentario);
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
