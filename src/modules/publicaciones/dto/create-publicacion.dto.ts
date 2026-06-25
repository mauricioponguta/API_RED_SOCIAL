import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({
    example: '6a39a03e526922e4c047cfea',
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
}
