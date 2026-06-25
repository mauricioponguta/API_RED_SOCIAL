import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Publicacion } from '../publicaciones/schemas/publicacion.schema';
import { User } from '../usuarios/schemas/user.schema';
import { ReaccionesService } from './reacciones.service';
import { Reaccion } from './schemas/reaccion.schema';

describe('ReaccionesService', () => {
  let service: ReaccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReaccionesService,
        {
          provide: getModelToken(Reaccion.name),
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

    service = module.get<ReaccionesService>(ReaccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
