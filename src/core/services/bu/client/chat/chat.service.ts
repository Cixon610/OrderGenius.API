import { Injectable } from '@nestjs/common';
import {
  BusinessService,
  ClientUserService,
  MenuPromptService,
  OpenaiService,
  OrderService,
} from 'src/core/services';
import { GithubService, SysConfigService } from 'src/infra/services';
import { ChainValues } from '@langchain/core/utils/types';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { ConversationChain } from 'langchain/chains';

@Injectable()
export class ChatService {
  constructor(
    protected readonly sysConfigService: SysConfigService,
    private readonly businessService: BusinessService,
    private readonly clientUserService: ClientUserService,
    private readonly orderService: OrderService,
    private readonly menuPromptService: MenuPromptService,
    // private readonly shoppingCartService: ShoppingCartService,
    // private readonly menuItemService: MenuItemService,
    // private readonly recommandService: RecommandService,
    private readonly githubService: GithubService,
    private readonly openaiService: OpenaiService,
  ) {}

  create(): string {
    return new Date().getTime().toString();
  }

  async *call(
    businessId: string,
    userId: string,
    sessionId: string,
    content: string,
  ): AsyncGenerator<string> {
    const redisKey = `chat:${userId}:${sessionId}`;
    const business = await this.businessService.get(businessId);
    const systemPrompt = await this.#getSystemPrompt(
      userId,
      business.id,
      business.name,
    );
    const functionCallingSConfig =
      await this.githubService.getFunctionCallings();

    yield* await this.openaiService.call(
      redisKey,
      systemPrompt,
      content,
      functionCallingSConfig,
    );
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
