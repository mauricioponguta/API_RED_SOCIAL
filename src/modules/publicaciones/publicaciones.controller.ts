import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { SearchPublicacionDto } from './dto/search-publicacion.dto';

@ApiTags('Publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly service: PublicacionesService) {}

  /**
   * Crear publicacion
   */
  @Post()
  create(
    @Body()
    dto: CreatePublicacionDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query()
    search: SearchPublicacionDto,
  ) {
    return this.service.findAll(search);
  }

  /**
   * Consultar publicaciones inactivas
   */
  @Get('inactivos')
  findInactive() {
    return this.service.findInactive();
  }

  /**
   * Buscar publicacion por id
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.service.findOne(id);
  }

  /**
   * Actualizar publicacion
   */
  @Put(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdatePublicacionDto,
  ) {
    return this.service.update(id, dto);
  }

  /**
   * Actualizacion Parcial
   */
  @Patch(':id')
  partialUpdate(
    @Param('id')
    id: string,
    @Body()
    dto: UpdatePublicacionDto,
  ) {
    return this.service.partialUpdate(id, dto);
  }

  /**
   * Restaurar una publicacion eliminada logicamente
   */
  @Patch(':id/restaurar')
  restore(
    @Param('id')
    id: string,
  ) {
    return this.service.restore(id);
  }

  /**
   * Eliminacion Logica
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.service.remove(id);
  }
}
