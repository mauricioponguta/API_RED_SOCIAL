import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioDto {
  @ApiProperty({
    example: '6a2b1b6615c425f640354c82',
  })
  @IsMongoId()
  @IsNotEmpty()
  publicacion_id!: string;

  @ApiProperty({
    example: '6a39a03e526922e4c047cfea',
  })
  @IsMongoId()
  @IsNotEmpty()
  usuario_id!: string;

  @ApiProperty({
    example: 'Excelente publicacion',
  })
  @IsString()
  @IsNotEmpty()
  comentario!: string;
}
