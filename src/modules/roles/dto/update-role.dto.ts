import {PartialType} from '@nestjs/swagger';
import {CreateRoleDto} from './create-role.dto';

/**
 * DTO para actualizar un rol
 * PartialType convierte todas las propiedades
 * CrateRoleDTO campos opcionales
 */

export class UpdateRoleDto extends PartialType(
    CreateRoleDto,
) {}

