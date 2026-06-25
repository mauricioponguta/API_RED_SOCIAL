import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { Comentario, ComentarioSchema } from './schemas/comentario.schema';
import {
  Publicacion,
  PublicacionSchema,
} from '../publicaciones/schemas/publicacion.schema';
import { User, UserSchema } from '../usuarios/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comentario.name,
        schema: ComentarioSchema,
      },
      {
        name: Publicacion.name,
        schema: PublicacionSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService],
})
export class ComentariosModule {}
