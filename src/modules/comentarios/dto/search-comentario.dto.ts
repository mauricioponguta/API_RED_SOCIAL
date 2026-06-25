import {
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchComentarioDto {
  @IsString()
  @IsOptional()
  comentario?: string;

  @IsMongoId()
  @IsOptional()
  publicacion_id?: string;

  @IsMongoId()
  @IsOptional()
  usuario_id?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
