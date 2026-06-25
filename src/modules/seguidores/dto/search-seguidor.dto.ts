import { IsMongoId, IsNumberString, IsOptional } from 'class-validator';

export class SearchSeguidorDto {
  @IsMongoId()
  @IsOptional()
  seguidor_id?: string;

  @IsMongoId()
  @IsOptional()
  seguido_id?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
