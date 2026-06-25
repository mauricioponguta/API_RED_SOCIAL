import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../usuarios/schemas/user.schema';
import { Seguidor, SeguidorSchema } from './schemas/seguidor.schema';
import { SeguidoresController } from './seguidores.controller';
import { SeguidoresService } from './seguidores.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Seguidor.name,
        schema: SeguidorSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SeguidoresController],
  providers: [SeguidoresService],
  exports: [SeguidoresService],
})
export class SeguidoresModule {}
