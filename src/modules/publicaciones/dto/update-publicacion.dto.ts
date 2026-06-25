import { PartialType } from '@nestjs/swagger';
import { CreatePublicacionDto } from './create-publicacion.dto';

/**
 * DTO para actualizar una publicacion
 * PartialType convierte todas las propiedades
 * CreatePublicacionDto en campos opcionales
 */

export class UpdatePublicacionDto extends PartialType(CreatePublicacionDto) {}
