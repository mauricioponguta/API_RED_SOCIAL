import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Publicacion,
  PublicacionSchema,
} from '../publicaciones/schemas/publicacion.schema';
import { User, UserSchema } from '../usuarios/schemas/user.schema';
import { ReaccionesController } from './reacciones.controller';
import { ReaccionesService } from './reacciones.service';
import { Reaccion, ReaccionSchema } from './schemas/reaccion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reaccion.name,
        schema: ReaccionSchema,
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
  controllers: [ReaccionesController],
  providers: [ReaccionesService],
  exports: [ReaccionesService],
})
export class ReaccionesModule {}
