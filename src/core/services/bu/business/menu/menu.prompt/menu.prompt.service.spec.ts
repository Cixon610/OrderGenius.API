import { Test, TestingModule } from '@nestjs/testing';
import { MenuPromptService } from './menu.prompt.service';

describe('MenuPromptService', () => {
  let service: MenuPromptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuPromptService],
    }).compile();

    service = module.get<MenuPromptService>(MenuPromptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
