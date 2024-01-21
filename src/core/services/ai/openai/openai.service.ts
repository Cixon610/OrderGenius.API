import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { SysConfigService } from 'src/infra/services';
import { delay } from 'rxjs';
import { BusinessService } from '../../bu/business/business/business.service';
import { BusinessUserService } from '../../bu/business/business.user/business.user.service';

@Injectable()
export class OpenaiService {
  private readonly openai;
  constructor(
    private readonly SysConfigService: SysConfigService,
    private readonly businessService: BusinessService,
    private readonly userService: BusinessUserService,
  ) {
    this.openai = new OpenAI({
      apiKey: SysConfigService.thirdParty.opeanaiApiKey,
    });
  }

  async createChat(businessId: string, userId: string) {
    const business = await this.businessService.get(businessId);
    const user = await this.userService.get(userId);
    const orderHistory = ['漢堡', '薯條', '可樂'];
    const assistantList = await this.openai.beta.assistants.list();
    //TODO: 改成ID
    const businessAssistant = assistantList.data.filter(
      (x) => x.name === `${business.name}_${user.userName}`,
    );
    const thread = await this.openai.beta.threads.create();
    if (businessAssistant.length > 0) {
      return {
        threadId: thread.id,
        assistantId: businessAssistant[0].id,
      };
    }
    //TODO: 餐單更新問題、客戶點餐歷史紀錄問題
    //客人資訊改道send再塞?
    const assistant = await this.openai.beta.assistants.create({
      name: `${business.name}_${user.userName}`,
      instructions: `你是${business.name}店員，請根據下述的各項目執行你的工作
        # 工作目標
        1. 請一步步引導客戶點選餐點直到能完成以下JSON的欄位
        {
          cutomer_name: {cutomer's name},
          price: {total price}
          products:[
            {
              Id: {index},
              productId: {product id from the menu},
              quantity: {product quantity},
              modification: {comma-seperated text summary from legit modifications},
              price: {order total price with modifications}
            }
          ],
          notes: {notes for this order if customer need to leave a message to the restaurant}
        }
        2. 客戶點餐完畢後須再次與客戶確認品項及數量，並回報總價後再向客戶做最後確認
        3. 客戶最終確認後，請呼叫get_weather方法，並將回傳json回應給客戶

        # 工作準則
        1. 僅能為客戶點選及推薦菜單中有的餐點
        2. 因客戶僅能透過你點餐，如果有回答錯誤或是使客戶混淆會導致你我都失業，請確實完成工作
        3. 如果客戶不知道點什麼，請依據以下順序規則推薦客戶餐點
          a.如果點餐歷史紀錄有值推薦菜單內類似餐點
          b.如果點餐歷史紀錄沒值或找不到菜單內類似餐點，請推薦菜單內promoted餐點

        # 客人資訊
        1. 客人姓名: ${user.userName}
        2. 客人電話: ${user.phone}
        3. 客人地址: ${user.address}
        4. 客人點餐歷史紀錄: ${orderHistory.join(', ')}

        # ${business.name}菜單
          找好茶	M	L
          茉莉綠茶	$30	$35
          阿薩姆紅茶	$30	$35
          四季春青茶	$30	$35
          黃金烏龍	$30	$35
          檸檬綠	$45	$55
          梅の綠	$45	$55
          桔子綠	$45	$55
          8冰綠	$45	$55
          養樂多綠	$45	$55
          冰淇淋紅茶	$45	$55
          旺來紅季節限定	$45	$55
          柚子紅	$45	$55
          鮮柚綠	$55	$65
`,
      tools: [{ type: 'code_interpreter' }],
      // model: 'gpt-3.5-turbo',
      model: 'gpt-4',
    });

    return {
      threadId: thread.id,
      assistantId: assistant.id,
    };
  }

  async sendChat(assistantId: string, threadId: string, content: string) {
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
    return messages.data[0].content[0].text.value;
  }

  async assistantTest() {
    const assistant = await this.openai.beta.assistants.create({
      name: 'Math Tutor',
      instructions:
        'You are a personal math tutor. Write and run code to answer math questions.',
      tools: [{ type: 'code_interpreter' }],
      model: 'gpt-4-1106-preview',
    });
    const thread = await this.openai.beta.threads.create();
    const message = await this.openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: 'Can you translate "How do you turn this on" to Japanese?',
    });
    const run = await this.openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      // instructions:
      //   'Please address the user as Jane Doe. The user has a premium account.',
    });
    const runStatus = await this.openai.beta.threads.runs.retrieve(
      thread.id,
      run.id,
    );
    const messages = await this.openai.beta.threads.messages.list(thread.id);
  }
}
