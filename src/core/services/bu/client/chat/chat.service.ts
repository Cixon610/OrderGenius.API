import { Injectable } from '@nestjs/common';
import {
  BusinessService,
  ClientUserService,
  MenuPromptService,
  OpenaiAgentService,
  OpenaiService,
  OrderService,
  ShoppingCartService,
} from 'src/core/services';
import { GithubService, SysConfigService } from 'src/infra/services';
import { ChatStreamRes } from 'src/core/constants/enums/chat.stream.res.enum';
import { ChatCreateResVo, ChatStreamResVo } from 'src/core/models';
import { ChatProviderEnum } from 'src/core/constants/enums/chat.provider.enum';
import { ChatTypeEnum } from 'src/core/constants/enums/chat.type.enum';

@Injectable()
export class ChatService {
  constructor(
    protected readonly sysConfigService: SysConfigService,
    private readonly businessService: BusinessService,
    private readonly clientUserService: ClientUserService,
    private readonly orderService: OrderService,
    private readonly menuPromptService: MenuPromptService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly githubService: GithubService,
    private readonly openaiService: OpenaiService,
    private readonly openaiAgentService: OpenaiAgentService,
  ) {}

  async create(
    provider: ChatProviderEnum,
    type: ChatTypeEnum,
    businessId: string,
    userId: string,
  ): Promise<ChatCreateResVo> {
    const business = await this.businessService.get(businessId);
    const systemPrompt = await this.#getSystemPrompt(
      userId,
      business.id,
      business.name,
    );
    
    switch (provider) {
      case ChatProviderEnum.OPENAI:
        switch (type) {
          case ChatTypeEnum.ASSISTANT:
            return await this.openaiAgentService.createChat(
              business.id,
              userId,
            );
          case ChatTypeEnum.LLM:
            return await this.openaiService.createChat(
              business.id,
              userId,
              systemPrompt,
            );
          default:
            throw new Error('Chat provider not supported');
        }
      default:
        throw new Error('Chat provider not supported');
    }
  }

  async *call(
    businessId: string,
    userId: string,
    userName: string,
    sessionId: string,
    content: string,
  ): AsyncGenerator<ChatStreamResVo> {
    let continueChat = true;
    const functionCallingSConfig = JSON.parse(
      await this.githubService.getFunctionCallings(),
    );

    while (continueChat) {
      for await (const dto of this.openaiService.sendChat(
        businessId,
        userId,
        userName,
        sessionId,
        content,
        functionCallingSConfig,
      )) {
        //看要不要回圈3次後就跳出，避免LLM一直tool call導致使用者一直等待
        switch (dto.type) {
          case 'message':
            yield new ChatStreamResVo({
              type: ChatStreamRes.MESSAGE,
              content: dto.content,
            });

            continueChat = false;
            
            const shoppingCart = await this.shoppingCartService.get(
              businessId,
              userId,
              userName,
            );

            if (shoppingCart) {
              yield new ChatStreamResVo({
                type: ChatStreamRes.SHOPPINGCART,
                content: shoppingCart,
              });
            }
            break;
          case 'tool_call':
            //tool call重打一次，因已將tool call的結果存入redis，所以清空content
            content = '';
            continue;
          default:
            break;
        }
      }
    }
  }

  async #getSystemPrompt(
    userId: string,
    businessId: string,
    businessName: string,
  ): Promise<string> {
    const user = await this.clientUserService.get(userId);
    const orders = await this.orderService.getByUserId(userId, 20);
    //Get latest 10 ordered item names
    const orderHistory = Array.from(
      new Set(orders?.flatMap((x) => x.detail.map((y) => y.itemName))),
    )?.slice(0, 10);
    const prompt = await this.githubService.getSysPrompt();
    const systemPrompt = prompt.replace('${businessName}', businessName);
    const costumerPrompt = `
    # 客人資訊
    1. 客人姓名: ${user.userName}
    2. 客人電話: ${user.phone}
    3. 客人地址: ${user.address}
    4. 客人點餐歷史紀錄: ${orderHistory?.join(', ')}`;

    const menuPrompt = await this.menuPromptService.getActiveCategory(
      businessId,
      businessName,
    );
    return `${systemPrompt} ${costumerPrompt} ${menuPrompt}`;
  }
}
