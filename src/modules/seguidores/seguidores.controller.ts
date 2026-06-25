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
import { CreateSeguidorDto } from './dto/create-seguidor.dto';
import { SearchSeguidorDto } from './dto/search-seguidor.dto';
import { UpdateSeguidorDto } from './dto/update-seguidor.dto';
import { SeguidoresService } from './seguidores.service';

@ApiTags('Seguidores')
@Controller('seguidores')
export class SeguidoresController {
  constructor(private readonly service: SeguidoresService) {}

  @Post()
  create(
    @Body()
    dto: CreateSeguidorDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query()
    search: SearchSeguidorDto,
  ) {
    return this.service.findAll(search);
  }

  @Get('inactivos')
  findInactive() {
    return this.service.findInactive();
  }

  @Get('usuario/:usuarioId/seguidores')
  findFollowers(
    @Param('usuarioId')
    usuarioId: string,
  ) {
    return this.service.findFollowers(usuarioId);
  }

  @Get('usuario/:usuarioId/siguiendo')
  findFollowing(
    @Param('usuarioId')
    usuarioId: string,
  ) {
    return this.service.findFollowing(usuarioId);
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
    dto: UpdateSeguidorDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateSeguidorDto,
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
