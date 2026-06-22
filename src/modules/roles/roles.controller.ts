import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly service: 
        RolesService,
    ) {}

    /**
     * Crear rol 
     */
    @Post()
    create(
        @Body()
        dto: CreateRoleDto,
    ) {
        return this.service.create(
            dto,
        );
    }
    @Get()
    findAll() {
        return this.service.findAll();
    }

    /**
     * Consultar roles inactivos
     */
    @Get('inactivos')    
    findInactive(){
        return this.service.findInactive();
    }

    /**
     * Buscar rol por id 
     */
    @Get(':id')
    findOne(
        @Param('id')
        id: string,
    ) {
        return this.service.findOne(id);
    }

    /**
     * Actualizar Rol
     */
    @Put(':id')
    update(
        @Param('id')
        id: string,

        @Body()
        dto: UpdateRoleDto,
    ) {
        return this.service.update(
            id, dto
        );
    }

    /**
     * Actualizacion Parcial
     */
    @Patch(':id')
    partialUpdate(
        @Param('id')
        id: string,
        @Body()
        dto: UpdateRoleDto,
    ) {
        return this.service.partialUpdate(
            id, dto
        );
    }
    
    /**
     * Restaurar un rol elimininado logicamente
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