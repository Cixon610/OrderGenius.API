import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiLlmService } from './openai.llm.service';

describe('OpenaiService', () => {
  let service: OpenaiLlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiLlmService],
    }).compile();

    service = module.get<OpenaiLlmService>(OpenaiLlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
