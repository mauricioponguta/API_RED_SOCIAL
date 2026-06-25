import {
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchPublicacionDto {
  @IsString()
  @IsOptional()
  contenido?: string;

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
