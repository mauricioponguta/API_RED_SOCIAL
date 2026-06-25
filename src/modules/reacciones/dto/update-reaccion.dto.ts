import { PartialType } from '@nestjs/swagger';
import { CreateReaccionDto } from './create-reaccion.dto';

export class UpdateReaccionDto extends PartialType(CreateReaccionDto) {}
