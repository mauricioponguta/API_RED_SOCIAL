import {
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  correo?: string;

  @IsMongoId()
  @IsOptional()
  rol_id?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
