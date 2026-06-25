import { IsIn, IsMongoId, IsNumberString, IsOptional } from 'class-validator';

export class SearchReaccionDto {
  @IsMongoId()
  @IsOptional()
  publicacion_id?: string;

  @IsMongoId()
  @IsOptional()
  usuario_id?: string;

  @IsIn(['LIKE', 'LOVE', 'DISLIKE'])
  @IsOptional()
  tipo_reaccion?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
