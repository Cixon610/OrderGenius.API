import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUserAuthController } from './business.user.auth.controller';

describe('BusinessUserAuthController', () => {
  let controller: BusinessUserAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUserAuthController],
    }).compile();

    controller = module.get<BusinessUserAuthController>(BusinessUserAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
