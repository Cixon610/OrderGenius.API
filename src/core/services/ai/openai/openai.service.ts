import OpenAI from 'openai';
import { delay } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { SysConfigService } from 'src/infra/services';
import { ChatCreateResVo, ChatSendResVo } from 'src/core/models';
import { OrderService } from '../../bu/client/order/order.service';
import { BusinessService } from '../../bu/business/business/business.service';
import { ClientUserService } from '../../bu/client/client.user/client.user.service';
import { MenuPromptService } from './../../bu/business/menu/menu.prompt/menu.prompt.service';
import { ShoppingCartService } from '../../bu/client/shopping-cart/shopping-cart.service';

@Injectable()
export class OpenaiService {
  private readonly openai;
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly businessService: BusinessService,
    private readonly clientUserService: ClientUserService,
    private readonly orderService: OrderService,
    private readonly menuPromptService: MenuPromptService,
    private readonly shoppingCartService: ShoppingCartService,
  ) {
    this.openai = new OpenAI({
      apiKey: sysConfigService.thirdParty.opeanaiApiKey,
    });
  }

  async createChat(businessId: string, userId: string) {
    const business = await this.businessService.get(businessId);
    const prompt = await this.#getSystemPrompt(
      userId,
      business.id,
      business.name,
    );
    const assistant = await this.#getAssistant(
      businessId,
      business.name,
      prompt,
    );

    const thread = await this.openai.beta.threads.create();

    return new ChatCreateResVo({
      threadId: thread.id,
      assistantId: assistant.id,
    });
  }

  //目前assistant api message role只支援user，暫時不能以system身分再疊加systemPrompt，先改用一個business_user一個Assistant的方式實作
  //TODO:建assistant response class
  async #getAssistant(businessId: string, name: string, systemPrompt: string) {
    const assistantList = await this.openai.beta.assistants.list();
    const assistantName = `${name}_${businessId}`;
    let businessAssistant = assistantList.data.filter(
      (x) => x.name === assistantName,
    );
    if (businessAssistant.length > 0) {
      //TODO:存在則更新sysPrompt
      await this.openai.beta.assistants.update(businessAssistant[0].id, {
        instructions: systemPrompt,
      });
      return businessAssistant[0];
    } else {
      //不存在則建立
      businessAssistant = await this.openai.beta.assistants.create({
        name: assistantName,
        instructions: systemPrompt,
        tools: [{ type: 'code_interpreter' }],
        model: 'gpt-4-1106-preview',
      });
    }
    return businessAssistant;
  }

  async #getSystemPrompt(
    userId: string,
    businessId: string,
    businessName: string,
  ): Promise<string> {
    const user = await this.clientUserService.get(userId);
    const orders = await this.orderService.getByUserId(userId);
    //Get latest 10 ordered item names
    const orderHistory = orders
      ?.slice(0, 10)
      ?.flatMap((x) => x.detail.map((y) => y.itemName));

    const systemPrompt = `
    你是${businessName}店員，請根據下述的各項目執行你的工作
    # 工作目標
    1. 請一步步引導客戶點選餐點直到能完成以下JSON的欄位
    {
      "detail": [
        {
          "itemId": "string",
          "modifications": "",
          "count": 0,
          "memo": "string"
        }
      ],
      "memo": "string"
    }
    2. 客戶點餐完畢後須再次與客戶確認品項及數量，並回報總價後再向客戶做最後確認
    3. 客戶最終確認後，請呼叫get_weather方法，並將回傳json回應給客戶

    # 工作準則
    1. 僅能為客戶點選及推薦菜單中有的餐點
    2. 因客戶僅能透過你點餐，如果有回答錯誤或是使客戶混淆會導致你我都失業，請確實完成工作
    3. 如果客戶不知道點什麼，請依據以下順序規則推薦客戶餐點
      a.如果點餐歷史紀錄有值推薦菜單內類似餐點
      b.如果點餐歷史紀錄沒值或找不到菜單內類似餐點，請推薦菜單內promoted餐點`;

    const costumerPrompt = `
    # 客人資訊
    1. 客人姓名: ${user.userName}
    2. 客人電話: ${user.phone}
    3. 客人地址: ${user.address}
    4. 客人點餐歷史紀錄: ${orderHistory?.join(', ')}`;

    const menuPrompt = await this.menuPromptService.getActive(
      businessId,
      businessName,
    );
    return `${systemPrompt} ${costumerPrompt} ${menuPrompt}`;
  }

  async sendChat(
    assistantId: string,
    threadId: string,
    content: string,
    businessId: string,
    userId: string,
    userName: string,
  ): Promise<ChatSendResVo> {
    const message = await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: content,
    });
    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      // instructions:
      //   'Please address the user as Jane Doe. The user has a premium account.',
    });
    // for await (const runStatus of this.openai.beta.threads.runs.list(
    //   threadId,
    // )) {
    //   if (runStatus.status === 'completed') {
    //     const messages = await this.openai.beta.threads.messages.list(threadId);
    //     return messages;
    //   }
    // }
    let status = 'queued';
    while (status !== 'completed') {
      const runStatus = await this.openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );
      status = runStatus.status;
      delay(300);
    }
    const messages = await this.openai.beta.threads.messages.list(threadId);
    const shoppingCart = await this.shoppingCartService.get(
      businessId,
      userId,
      userName,
    );
    return new ChatSendResVo({
      message: messages.data[0].content[0].text.value,
      shoppingCart: shoppingCart,
    });
  }
}
