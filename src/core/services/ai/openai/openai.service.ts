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
import { AssistantsRunStatus } from 'src/core/constants/enums/assistants.run.status.enum';
import { assistantsTools } from 'src/core/constants/assistants.tools';
import { MenuItemService } from '../../bu/business/menu/menu.item.service/menu.item.service';
import { RecommandService } from '../../bu/client/recommand/recommand.service';

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
    private readonly menuItemService: MenuItemService,
    private readonly recommandService: RecommandService,
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
        tools: assistantsTools,
      });
      return businessAssistant[0];
    } else {
      //不存在則建立
      businessAssistant = await this.openai.beta.assistants.create({
        name: assistantName,
        instructions: systemPrompt,
        tools: assistantsTools,
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
    const orders = await this.orderService.getByUserId(userId, 20);
    //Get latest 10 ordered item names
    const orderHistory = Array.from(
      new Set(orders?.flatMap((x) => x.detail.map((y) => y.itemName))),
    )?.slice(0, 10);

    const systemPrompt = `
    你是${businessName}店員，請根據下述的各項目執行你的工作
# 工作目標
1.下方菜單會提供你店內菜單的分類資訊，請透過這些資訊引導客戶點餐
2.當客戶詢問餐點問題依現有資料無法回答時，請呼叫對應API取得資訊
3.請一步步引導客戶點選餐點直到能完成modify_shopping_cart請求的參數
4.客戶要點任何餐點時並須先取得商品詳細資訊並判斷是否有modification並讓客戶回答後，等收集完modify_shopping_cart請求的參數才可更改shoppingCart
5.客戶點餐完畢後須再次與客戶確認品項及數量，並呼叫getShoppingCart取得totalPrice後與客戶做最後確認

# 工作準則
1. 僅能為客戶點選及推薦菜單中有的餐點
2. 因客戶僅能透過你點餐，如果有回答錯誤或是使客戶混淆會導致你我都失業，請確實完成工作
3. 客戶與你僅會使用品項名稱，並不會有品項編號等資訊，如果需要詳細資料請依品項名稱呼叫search_item_by_key api取得詳細資訊

# API呼叫情境
1. 如果客戶不知道點什麼，請呼叫get_recommand api取得推薦商品資訊
2. 如果客戶點的品項你並不知道該品項詳細資料，請呼叫search_item_by_key api依客戶點的品項名稱取得對應品項的資訊
3. 如果客戶要求看所有品項時，請呼叫get_all_items取得所有品項名稱
4. 如果客戶要查看訂單紀錄時，請呼叫get_order_history
5. 如果客戶要查看購物車時，get_shopping_cart
6. 如果客戶要更改購物車時，請呼叫modify_shopping_cart

# 語氣
1.不可與客戶吵架或說髒話
2.根據客戶的語氣回覆對應的語調，但不可粗魯或帶有惡意

# 例外處裡
1.API如有錯誤請與客戶重新確認需求再執行`;

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
    });
    // for await (const runStatus of this.openai.beta.threads.runs.list(
    //   threadId,
    // )) {
    //   if (runStatus.status === 'completed') {
    //     const messages = await this.openai.beta.threads.messages.list(threadId);
    //     return messages;
    //   }
    // }
    let isProcessing = true;
    while (isProcessing) {
      const runStatus = await this.openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );
      switch (runStatus.status) {
        case AssistantsRunStatus.COMPLETED:
          isProcessing = false;
          break;
        case AssistantsRunStatus.REQUIRES_ACTION:
          const toolOutputs = await this.#toolCalls(
            runStatus,
            businessId,
            userId,
            userName,
          );

          // Submit tool outputs
          await this.openai.beta.threads.runs.submitToolOutputs(
            threadId,
            run.id,
            { tool_outputs: toolOutputs },
          );
          break;
        case AssistantsRunStatus.EXPIRED:
        case AssistantsRunStatus.FAILED:
          throw new Error('Assistant run failed or expired.');
          break;
        case AssistantsRunStatus.IN_PROGRESS:
        case AssistantsRunStatus.QUEUED:
        case AssistantsRunStatus.CANCELLING:
        case AssistantsRunStatus.CANCELLED:
        default:
          break;
      }

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

  async #toolCalls(
    runStatus: any,
    businessId: string,
    userId: string,
    userName: string,
  ) {
    const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
    const toolOutputs = [];

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;

      console.log(
        `This question requires us to call a function: ${functionName}`,
      );

      const args = JSON.parse(toolCall.function.arguments);

      // const argsArray = Object.keys(args).map((key) => args[key]);

      // // Dynamically call the function with arguments
      // const output = await global[functionName].apply(null, [args]);
      let result = null;
      switch (functionName) {
        case 'get_recommand':
          result = await this.recommandService.getItemNames(businessId, userId);
          break;
        case 'get_order_history':
          result = await this.orderService.getByUserId(userId, args.count);
          break;
        case 'get_all_items':
          const allItems = await this.menuItemService.getByBusinessId(
            businessId,
          );
          result = allItems.map((x) => x.name);
          break;
        case 'search_item_by_key':
          result = await this.menuItemService.getByKey(businessId, args.key);
          break;
        case 'get_shopping_cart':
          result = await this.shoppingCartService.get(
            businessId,
            userId,
            userName,
          );
          break;
        case 'modify_shopping_cart':
          result = await this.shoppingCartService.set(
            businessId,
            userId,
            userName,
            args.value,
          );
          break;

        default:
          break;
      }

      toolOutputs.push({
        tool_call_id: toolCall.id,
        output: JSON.stringify(result),
      });
      return toolOutputs;
    }
  }
}
