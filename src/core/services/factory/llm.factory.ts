import { Injectable } from '@nestjs/common';
import { LlmProviderEnum } from '../../constants/enums/llm.provider.enum';
import { LlmTypeEnum } from '../../constants/enums/llm.type.enum';
import { ILLMService } from '../../models/interface/llm.service.interface';
import { OpenaiAgentService } from '../ai/openai.agent/openai.agent.service';
import { OpenaiLlmService } from '../ai/openai.llm/openai.llm.service';

@Injectable()
export class LlmFactory {
  constructor(
    private readonly openaiAgentService: OpenaiAgentService,
    private readonly openaiLlmService: OpenaiLlmService,
  ) {}

  create(provider: LlmProviderEnum, type: LlmTypeEnum): ILLMService {
    switch (provider) {
      case LlmProviderEnum.OPENAI:
        switch (type) {
          case LlmTypeEnum.ASSISTANT:
            return this.openaiAgentService;
          case LlmTypeEnum.LLM:
            return this.openaiLlmService;
          default:
            throw new Error('Chat provider not supported');
        }
      default:
        throw new Error('Chat provider not supported');
    }
  }
}
