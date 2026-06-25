import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../usuarios/schemas/user.schema';
import { Seguidor } from './schemas/seguidor.schema';
import { SeguidoresService } from './seguidores.service';

describe('SeguidoresService', () => {
  let service: SeguidoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeguidoresService,
        {
          provide: getModelToken(Seguidor.name),
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SeguidoresService>(SeguidoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
