import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Mauricio',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres' })
  nombre!: string;

  @ApiProperty({
    description: 'Correo del usuario',
    example: 'mauricio@gmail.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El correo no debe exceder los 100 caracteres' })
  correo!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  password!: string;

  @ApiProperty({
    example: '6a2b14b215c425f640354c7f',
  })
  @IsMongoId()
  @IsNotEmpty()
  rol_id!: string;
}
