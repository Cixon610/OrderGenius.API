import { LlmProviderEnum } from 'src/core/constants/enums/llm.provider.enum';
import { LlmTypeEnum } from 'src/core/constants/enums/llm.type.enum';

export class LlmChatCreateDto {
  public constructor(init?: Partial<LlmChatCreateDto>) {
    Object.assign(this, init);
  }

  provider: LlmProviderEnum;
  type: LlmTypeEnum;
  businessId: string;
  userId: string;
}
