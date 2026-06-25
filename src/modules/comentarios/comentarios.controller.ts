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
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { SearchComentarioDto } from './dto/search-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@ApiTags('Comentarios')
@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly service: ComentariosService) {}

  @Post()
  create(
    @Body()
    dto: CreateComentarioDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query()
    search: SearchComentarioDto,
  ) {
    return this.service.findAll(search);
  }

  @Get('inactivos')
  findInactive() {
    return this.service.findInactive();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateComentarioDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateComentarioDto,
  ) {
    return this.service.partialUpdate(id, dto);
  }

  @Patch(':id/restaurar')
  restore(
    @Param('id')
    id: string,
  ) {
    return this.service.restore(id);
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.service.remove(id);
  }
}
