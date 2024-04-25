import { Test, TestingModule } from '@nestjs/testing';
import { ToolCallsService } from './tool.calls.service';

describe('ToolCallsService', () => {
  let service: ToolCallsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolCallsService],
    }).compile();

    service = module.get<ToolCallsService>(ToolCallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
