import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({
    example: '6678f6b5b46fbd8c12345678',
  })
  @IsMongoId()
  @IsNotEmpty()
  usuario_id!: string;

  @ApiProperty({
    example: 'Mi primera publicacion',
  })
  @IsString()
  @IsNotEmpty()
  contenido!: string;

  @ApiProperty({
    example: 'https://imagenes.com/publicacion.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imagen?: string;
}
