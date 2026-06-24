import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './modules/roles/roles.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PublicacionesModule } from './modules/publicaciones/publicaciones.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RolesModule,
    UsuariosModule,
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    PublicacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
