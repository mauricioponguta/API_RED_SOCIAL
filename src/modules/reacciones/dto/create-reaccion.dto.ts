import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateReaccionDto {
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
    example: 'LIKE',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['LIKE', 'LOVE', 'DISLIKE'])
  tipo_reaccion!: string;
}
