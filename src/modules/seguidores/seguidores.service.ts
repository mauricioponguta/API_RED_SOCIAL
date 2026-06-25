import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { User, UserDocument } from '../usuarios/schemas/user.schema';
import { CreateSeguidorDto } from './dto/create-seguidor.dto';
import { SearchSeguidorDto } from './dto/search-seguidor.dto';
import { UpdateSeguidorDto } from './dto/update-seguidor.dto';
import { Seguidor, SeguidorDocument } from './schemas/seguidor.schema';

@Injectable()
export class SeguidoresService {
  constructor(
    @InjectModel(Seguidor.name)
    private readonly seguidorModel: Model<SeguidorDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateSeguidorDto) {
    this.validateDifferentUsers(dto.seguidor_id, dto.seguido_id);
    await this.ensureUserExists(
      dto.seguidor_id,
      'Seguidor no encontrado o inactivo',
    );
    await this.ensureUserExists(
      dto.seguido_id,
      'Usuario seguido no encontrado o inactivo',
    );

    const exists = await this.seguidorModel.findOne({
      seguidor_id: dto.seguidor_id,
      seguido_id: dto.seguido_id,
      activo: true,
    });

    if (exists) {
      throw new BadRequestException('Ya existe esta relacion de seguimiento');
    }

    const seguidor = await this.seguidorModel.create(dto);
    return ResponseHelper.success(seguidor, 201);
  }

  async findAll(search: SearchSeguidorDto = {}) {
    const filter: any = { activo: true };

    if (search.seguidor_id) {
      this.validateObjectId(search.seguidor_id, 'Seguidor no valido');
      filter.seguidor_id = search.seguidor_id;
    }

    if (search.seguido_id) {
      this.validateObjectId(search.seguido_id, 'Usuario seguido no valido');
      filter.seguido_id = search.seguido_id;
    }

    const page = Number(search.page) || 1;
    const limit = Number(search.limit) || 10;

    const seguidores = await this.seguidorModel
      .find(filter)
      .populate('seguidor_id', '-password')
      .populate('seguido_id', '-password')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.seguidorModel.countDocuments(filter);

    return ResponseHelper.success({
      total,
      page,
      limit,
      data: this.removeBrokenRelations(seguidores),
    });
  }

  async findInactive() {
    const seguidores = await this.seguidorModel
      .find({ activo: false })
      .populate('seguidor_id', '-password')
      .populate('seguido_id', '-password');

    return ResponseHelper.success(seguidores);
  }

  async findFollowers(usuarioId: string) {
    this.validateObjectId(usuarioId, 'Usuario no valido');

    const seguidores = await this.seguidorModel
      .find({
        seguido_id: usuarioId,
        activo: true,
      })
      .populate('seguidor_id', '-password')
      .populate('seguido_id', '-password');

    return ResponseHelper.success(this.removeBrokenRelations(seguidores));
  }

  async findFollowing(usuarioId: string) {
    this.validateObjectId(usuarioId, 'Usuario no valido');

    const siguiendo = await this.seguidorModel
      .find({
        seguidor_id: usuarioId,
        activo: true,
      })
      .populate('seguidor_id', '-password')
      .populate('seguido_id', '-password');

    return ResponseHelper.success(this.removeBrokenRelations(siguiendo));
  }

  async findOne(id: string) {
    this.validateObjectId(id, 'Relacion de seguimiento no valida');

    const seguidor = await this.seguidorModel
      .findById(id)
      .populate('seguidor_id', '-password')
      .populate('seguido_id', '-password');

    if (!seguidor) {
      throw new NotFoundException('Relacion de seguimiento no encontrada');
    }

    this.ensureRelationHasUsers(seguidor);

    return ResponseHelper.success(seguidor);
  }

  async update(id: string, dto: UpdateSeguidorDto) {
    this.validateObjectId(id, 'Relacion de seguimiento no valida');

    const seguidor = await this.seguidorModel.findById(id);

    if (!seguidor) {
      throw new NotFoundException('Relacion de seguimiento no encontrada');
    }

    const nextSeguidorId = dto.seguidor_id ?? String(seguidor.seguidor_id);
    const nextSeguidoId = dto.seguido_id ?? String(seguidor.seguido_id);

    this.validateDifferentUsers(nextSeguidorId, nextSeguidoId);

    if (dto.seguidor_id) {
      await this.ensureUserExists(
        dto.seguidor_id,
        'Seguidor no encontrado o inactivo',
      );
    }

    if (dto.seguido_id) {
      await this.ensureUserExists(
        dto.seguido_id,
        'Usuario seguido no encontrado o inactivo',
      );
    }

    const updatedSeguidor = await this.seguidorModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    );

    return ResponseHelper.success(updatedSeguidor);
  }

  async partialUpdate(id: string, dto: UpdateSeguidorDto) {
    this.validateObjectId(id, 'Relacion de seguimiento no valida');

    const seguidor = await this.seguidorModel.findById(id);

    if (!seguidor) {
      throw new NotFoundException('Relacion de seguimiento no encontrada');
    }

    const nextSeguidorId = dto.seguidor_id ?? String(seguidor.seguidor_id);
    const nextSeguidoId = dto.seguido_id ?? String(seguidor.seguido_id);

    this.validateDifferentUsers(nextSeguidorId, nextSeguidoId);

    if (dto.seguidor_id) {
      await this.ensureUserExists(
        dto.seguidor_id,
        'Seguidor no encontrado o inactivo',
      );
    }

    if (dto.seguido_id) {
      await this.ensureUserExists(
        dto.seguido_id,
        'Usuario seguido no encontrado o inactivo',
      );
    }

    const updatedSeguidor = await this.seguidorModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    return ResponseHelper.success(updatedSeguidor);
  }

  async remove(id: string) {
    this.validateObjectId(id, 'Relacion de seguimiento no valida');

    const seguidor = await this.seguidorModel.findById(id);

    if (!seguidor) {
      throw new NotFoundException('Relacion de seguimiento no encontrada');
    }

    const deletedSeguidor = await this.seguidorModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    return ResponseHelper.success(deletedSeguidor);
  }

  async restore(id: string) {
    this.validateObjectId(id, 'Relacion de seguimiento no valida');

    const seguidor = await this.seguidorModel.findById(id);

    if (!seguidor) {
      throw new NotFoundException('Relacion de seguimiento no encontrada');
    }

    const restoredSeguidor = await this.seguidorModel.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true },
    );

    return ResponseHelper.success(restoredSeguidor);
  }

  private validateObjectId(id: string, message: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(message);
    }
  }

  private validateDifferentUsers(seguidorId: string, seguidoId: string) {
    if (seguidorId === seguidoId) {
      throw new BadRequestException('Un usuario no puede seguirse a si mismo');
    }
  }

  private async ensureUserExists(id: string, message: string) {
    this.validateObjectId(id, 'Usuario no valido');

    const user = await this.userModel.findOne({
      _id: id,
      activo: true,
    });

    if (!user) {
      throw new NotFoundException(message);
    }
  }

  private ensureRelationHasUsers(seguidor: SeguidorDocument) {
    if (!seguidor.seguidor_id || !seguidor.seguido_id) {
      throw new NotFoundException(
        'La relacion de seguimiento apunta a usuarios que no existen',
      );
    }
  }

  private removeBrokenRelations(seguidores: SeguidorDocument[]) {
    return seguidores.filter(
      (seguidor) => seguidor.seguidor_id && seguidor.seguido_id,
    );
  }
}
