import { LlmProviderEnum } from 'src/core/constants/enums/llm.provider.enum';
import { LlmTypeEnum } from 'src/core/constants/enums/llm.type.enum';

export class LlmChatSendDto {
  public constructor(init?: Partial<LlmChatSendDto>) {
    Object.assign(this, init);
  }
  provider: LlmProviderEnum;
  type: LlmTypeEnum;
  businessId: string;
  userId: string;
  userName: string;
  assistantId: string;
  threadId: string;
  content: string;
  toolcalls: any[];
}
