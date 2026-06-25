import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Publicacion } from '../publicaciones/schemas/publicacion.schema';
import { User } from '../usuarios/schemas/user.schema';
import { ComentariosService } from './comentarios.service';
import { Comentario } from './schemas/comentario.schema';

describe('ComentariosService', () => {
  let service: ComentariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComentariosService,
        {
          provide: getModelToken(Comentario.name),
          useValue: {},
        },
        {
          provide: getModelToken(Publicacion.name),
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ComentariosService>(ComentariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
