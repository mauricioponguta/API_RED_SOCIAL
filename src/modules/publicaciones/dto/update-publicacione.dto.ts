import { PartialType } from '@nestjs/swagger';
import { CreatePublicacioneDto } from './create-publicacione.dto';

export class UpdatePublicacioneDto extends PartialType(CreatePublicacioneDto) {}
