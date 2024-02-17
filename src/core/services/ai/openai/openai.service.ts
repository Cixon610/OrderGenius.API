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
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  async clearRuns(threadId: string) {
    const runs = await this.openai.beta.threads.runs.list(threadId);
    for (const run of runs.data) {
      if (run.status !== AssistantsRunStatus.COMPLETED)
        await this.openai.beta.threads.runs.cancel(threadId, run.id);
    }
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
        model: 'gpt-4',
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

    const systemPrompt = `你是${businessName}店員，請根據下述的各項目執行你的工作
# 目標
* 引導客戶點餐
* 若依目前資訊無法回答客戶，請呼叫對應API取得資訊
* 餐點的modification.options.minChoices為必選數量，若minChoices>0必須要求客戶選擇
* 當餐點名稱、數量及客製化的選項都收集其後即可加進購物車
* 當你判斷需要呼叫modify_shopping_cart function時，請與客戶確認你目前即將要加進購物車的資訊，如: 餐點名稱、數量及客製化的選項，待客戶回覆同意後，才可呼叫
* 購物車家完後請告知用戶是否再加點或是確認完成點餐

# 準則
* 因客戶僅能透過你點餐，若回答錯誤或是使客戶混淆會導致你我都失業，請確實完成工作
* 僅能為客戶點選系統中存在的餐點
* 僅能依餐點描述為客戶介紹，不可加油添醋
* 每次對答請盡量限制在30字內

# 語氣
* 不可與客戶吵架或說髒話
* 根據客戶的語氣回覆對應的語調，但不可粗魯或帶有惡意

# 例外處裡
* API如回覆錯誤請回覆客戶"系統錯誤，請稍後再試"
`;

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

      const args = JSON.parse(toolCall.function.arguments);

      console.log(
        `Function Calling: ${functionName}, Args: ${JSON.stringify(args)}`,
      );
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
            args.count,
          );
          result = allItems.map((x) => x.name);
          break;
        case 'search_item_by_key':
          result = await this.menuItemService.getItemModificationsByKey(
            businessId,
            args.key,
          );
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
            args,
          );
          break;

        default:
          break;
      }

      toolOutputs.push({
        tool_call_id: toolCall.id,
        output: JSON.stringify(result),
      });
      console.log(
        `Function Called: ${functionName}, Result: ${JSON.stringify(result)}`,
      );
    }
    return toolOutputs;
  }
}
