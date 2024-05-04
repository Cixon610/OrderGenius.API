import { ChatSendDto } from '../dto/client/chat.send.dto/chat.send.dto';
import { LlmChatSendDto } from '../dto/client/llm.chat.send.dto/llm.chat.send.dto';
import { ChatCreateResVo } from '../vo/2c/res/chat/chat.create.res.vo/chat.create.res.vo';

export interface ILLMService {
  createChat(
    businessId: string,
    userId: string,
    systemPrompt: string,
  ): Promise<ChatCreateResVo>;

  sendChat(dto: LlmChatSendDto): AsyncGenerator<ChatSendDto>;
}
