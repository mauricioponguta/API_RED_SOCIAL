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
import { CreateReaccionDto } from './dto/create-reaccion.dto';
import { SearchReaccionDto } from './dto/search-reaccion.dto';
import { UpdateReaccionDto } from './dto/update-reaccion.dto';
import { ReaccionesService } from './reacciones.service';

@ApiTags('Reacciones')
@Controller('reacciones')
export class ReaccionesController {
  constructor(private readonly service: ReaccionesService) {}

  @Post()
  create(
    @Body()
    dto: CreateReaccionDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query()
    search: SearchReaccionDto,
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
    dto: UpdateReaccionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateReaccionDto,
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
