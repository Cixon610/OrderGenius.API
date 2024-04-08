import { Test, TestingModule } from '@nestjs/testing';
import { LlmBaseServiceService } from './llm.base.service.service';

describe('LlmBaseServiceService', () => {
  let service: LlmBaseServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmBaseServiceService],
    }).compile();

    service = module.get<LlmBaseServiceService>(LlmBaseServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
