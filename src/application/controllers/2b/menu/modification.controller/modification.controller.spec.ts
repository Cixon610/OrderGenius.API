import { Test, TestingModule } from '@nestjs/testing';
import { ModificationController } from './modification.controller';

describe('ModificationController', () => {
  let controller: ModificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModificationController],
    }).compile();

    controller = module.get<ModificationController>(ModificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
