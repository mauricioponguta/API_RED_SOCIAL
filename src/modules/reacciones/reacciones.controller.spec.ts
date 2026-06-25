import { Test, TestingModule } from '@nestjs/testing';
import { ReaccionesController } from './reacciones.controller';
import { ReaccionesService } from './reacciones.service';

describe('ReaccionesController', () => {
  let controller: ReaccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReaccionesController],
      providers: [
        {
          provide: ReaccionesService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReaccionesController>(ReaccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
