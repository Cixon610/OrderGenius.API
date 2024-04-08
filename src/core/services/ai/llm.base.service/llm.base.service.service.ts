import { Injectable } from '@nestjs/common';
import { BaseChatMemory, BufferMemory } from 'langchain/memory';
import { RedisChatMessageHistory } from '@langchain/community/stores/message/ioredis';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { SysConfigService } from 'src/infra/services';

@Injectable()
export class LLMBaseServiceService {
  protected sysConfigService: SysConfigService;
  constructor(config: SysConfigService) {
    this.sysConfigService = config;
  }
  protected createRedisMemory(sessionId: string): BaseChatMemory {
    const chatHistory = new RedisChatMessageHistory({
      sessionId: sessionId,
      sessionTTL: this.sysConfigService.infra.redisExpire,
      url: this.sysConfigService.infra.redisUrl,
    });
    const memory = new BufferMemory({ chatHistory });
    return memory;
  }
}
