import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class SearchPublicacionDto {
  @IsString()
  @IsOptional()
  contenido?: string;

  @IsMongoId()
  @IsOptional()
  usuario_id?: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}
