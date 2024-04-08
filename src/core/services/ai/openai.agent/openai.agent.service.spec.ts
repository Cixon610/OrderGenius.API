import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiAgentService } from './openai.agent.service';

describe('OpenaiAgentService', () => {
  let service: OpenaiAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiAgentService],
    }).compile();

    service = module.get<OpenaiAgentService>(OpenaiAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
