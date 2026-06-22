import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/roles.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { UpdateRoleDto } from './dto/update-role.dto';


@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) 
        private roleModel: 
        Model<RoleDocument>,
    ){}

    /** 
     * Metodo para crear un nuevo rol
     */

    async create(
        dto:CreateRoleDto,
    ) {
        const role=
        await this.roleModel.create(dto);

        return ResponseHelper.success(
            role,
            201,
        );

    }
    /**
     * Metodo para consultar roles
     */
    async findAll() {
        const roles = 
        await this.roleModel.find({ activo: true });

        return ResponseHelper.success(roles);
    }
    /**
     * Consulta roles eliminados logicamente
     */
    async findInactive() {
        const roles = 
        await this.roleModel.find({ activo: false });
        return ResponseHelper.success(roles);
    }
    /**
     * Buscar un rol por su id 
     * */
    async findOne(id: string) {
        const role = await this.roleModel.findById(id);

        if (!role){
            throw new NotFoundException('Rol no encontrado');
        }
        return ResponseHelper.success(role);
        }

    /**
     * Metodo para actualizar un rol
     */
    async update(id: string, dto: UpdateRoleDto) {
        const role = await this.roleModel.findById(id);

        if (!role){
            throw new NotFoundException('Rol no encontrado');
        }
        const updatedRole = await this.roleModel.findByIdAndUpdate(id, dto, { new: true });

        return ResponseHelper.success(updatedRole);
    }

    /**
     * Actulizacion parcial
     */
    async partialUpdate(id: string, dto: UpdateRoleDto) {
        const role = await this.roleModel.findById(id);

        if (!role){
            throw new NotFoundException('Rol no encontrado');
        }

        const updatedRole = await this.roleModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
        return ResponseHelper.success(updatedRole);
    }

    /**
     * Eliminacion logica
    */
   
    async remove(id: string) {
        const role = await this.roleModel.findById(id);

        if (!role){
            throw new NotFoundException('Rol no encontrado');
        }
        const deletedRole = await this.roleModel.findByIdAndUpdate(id, { activo: false }, { new: true });
        return ResponseHelper.success(deletedRole);
    }

    /**
     * Restaurar un rol eliminado logicamente
     */
    async restore(id: string) {
        const role = await this.roleModel.findById(id);

        if (!role){
            throw new NotFoundException('Rol no encontrado');
        }
        const restoredRole = await this.roleModel.findByIdAndUpdate(id, { activo: true }, { new: true });
        return ResponseHelper.success(restoredRole);
    }
}
