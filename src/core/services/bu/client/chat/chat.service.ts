import { Injectable } from '@nestjs/common';
import {
  BusinessService,
  ClientUserService,
  MenuPromptService,
  OpenaiService,
  OrderService,
} from 'src/core/services';
import { GithubService, SysConfigService } from 'src/infra/services';
import { randomUUID } from 'crypto';

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

  async create(businessId: string, userId: string): Promise<any> {
    const sessionId = randomUUID();
    const redisKey = `chat:${userId}:${sessionId}`;
    const business = await this.businessService.get(businessId);
    const systemPrompt = await this.#getSystemPrompt(
      userId,
      business.id,
      business.name,
    );

    //TEST
    // const systemPrompt = "你是AI小助手，根據用戶的需求呼叫對應API並回答問題"
    this.openaiService.createChat(redisKey, systemPrompt);

    return {
      businessId,
      sessionId,
    };
  }

  async *call(
    businessId: string,
    userId: string,
    userName: string,
    sessionId: string,
    content: string,
  ): AsyncGenerator<string> {
    const redisKey = `chat:${userId}:${sessionId}`;
    let continueChat = true;
    const functionCallingSConfig =
      JSON.parse(await this.githubService.getFunctionCallings());
    
    //TEST
    // const functionCallingSConfig = [
    //   {
    //     type: 'function',
    //     function: {
    //       name: 'get_weather',
    //       description: '取得現在天氣資訊',
    //       parameters: {
    //         type: 'object',
    //         properties: {
    //           place: {
    //             type: 'string',
    //             description: '地點',
    //           },
    //         },
    //         required: ['place'],
    //       },
    //     },
    //   },
    //   {
    //     type: 'function',
    //     function: {
    //       name: 'get_time',
    //       description: '取得現在時間資訊',
    //       parameters: {
    //         type: 'object',
    //         properties: {
    //           UTC: {
    //             type: 'integer',
    //             description: 'UTC 時區',
    //           },
    //         },
    //         required: ['UTC'],
    //       },
    //     },
    //   },
    // ];

    while (continueChat) {
      for await (const dto of this.openaiService.sendChat(
        businessId,
        userId,
        userName,
        redisKey,
        content,
        functionCallingSConfig,
      )) {
        if (dto.type === 'message') {
          yield dto.content;
          continueChat = false;
        }
        else if (dto.type === 'tool_call') {
          //tool call重打一次，因已將tool call的結果存入redis，所以清空content
          content = '';
          continue;
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
