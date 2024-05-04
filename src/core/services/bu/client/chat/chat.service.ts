import { Injectable } from '@nestjs/common';
import {
  BusinessService,
  ClientUserService,
  MenuPromptService,
  OrderService,
  ShoppingCartService,
} from 'src/core/services';
import { GithubService, SysConfigService } from 'src/infra/services';
import { ChatStreamRes } from 'src/core/constants/enums/chat.stream.res.enum';
import {
  ChatCreateResVo,
  ChatStreamResVo,
  LlmChatCreateDto,
  LlmChatSendDto,
} from 'src/core/models';
import { LlmFactory } from 'src/core/services/factory/llm.factory';

@Injectable()
export class ChatService {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly businessService: BusinessService,
    private readonly clientUserService: ClientUserService,
    private readonly orderService: OrderService,
    private readonly menuPromptService: MenuPromptService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly githubService: GithubService,
    private readonly llmFactory: LlmFactory,
  ) {}

  async create(dto: LlmChatCreateDto): Promise<ChatCreateResVo> {
    const business = await this.businessService.get(dto.businessId);
    const systemPrompt = await this.#getSystemPrompt(
      dto.userId,
      business.id,
      business.name,
    );
    const llm = this.llmFactory.create(dto.provider, dto.type);
    return llm.createChat(business.id, dto.userId, systemPrompt);
  }

  async *send(dto: LlmChatSendDto): AsyncGenerator<ChatStreamResVo> {
    const llm = this.llmFactory.create(dto.provider, dto.type);
    dto.toolcalls = JSON.parse(await this.githubService.getFunctionCallings());

    for await (const content of llm.sendChat(dto)) {
      yield content;
    }

    const shoppingCart = await this.shoppingCartService.get(
      dto.businessId,
      dto.userId,
      dto.userName,
    );

    if (shoppingCart) {
      yield new ChatStreamResVo({
        type: ChatStreamRes.SHOPPINGCART,
        content: shoppingCart,
      });
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

    if (this.sysConfigService.thirdParty.githubBranchName === 'master') {
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

    return prompt;
  }
}
