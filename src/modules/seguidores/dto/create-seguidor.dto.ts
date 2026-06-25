import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSeguidorDto {
  @ApiProperty({
    example: '6a39a03e526922e4c047cfea',
  })
  @IsMongoId()
  @IsNotEmpty()
  seguidor_id!: string;

  @ApiProperty({
    example: '6a3d6d0bcb7673e6a6ecd0b0',
  })
  @IsMongoId()
  @IsNotEmpty()
  seguido_id!: string;
}
