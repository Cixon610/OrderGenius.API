import { Modification } from './../../../../infra/typeorm/entities/Modification';
import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { GithubService, SysConfigService } from 'src/infra/services';
import { ChatCreateResVo, ChatSendResVo } from 'src/core/models';
import { OrderService } from '../../bu/client/order/order.service';
import { BusinessService } from '../../bu/business/business/business.service';
import { ClientUserService } from '../../bu/client/client.user/client.user.service';
import { MenuPromptService } from './../../bu/business/menu/menu.prompt/menu.prompt.service';
import { ShoppingCartService } from '../../bu/client/shopping-cart/shopping-cart.service';
import { AssistantsRunStatus } from 'src/core/constants/enums/assistants.run.status.enum';
import { MenuItemService } from '../../bu/business/menu/menu.item.service/menu.item.service';
import { RecommandService } from '../../bu/client/recommand/recommand.service';
import { ModificationService } from '../../bu/business/menu/modification/modification.service';

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
    private readonly githubService: GithubService,
    private readonly modificationService: ModificationService,
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
    this.clearRuns(threadId);
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
    let loopCount = 0;
    while (
      isProcessing &&
      loopCount < this.sysConfigService.thirdParty.openaiLoopLimit
    ) {
      const runStatus = await this.openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );
      console.log(`Run status: ${runStatus.status}`);
      loopCount++;
      switch (runStatus.status) {
        case AssistantsRunStatus.COMPLETED:
          isProcessing = false;
          break;
        case AssistantsRunStatus.REQUIRES_ACTION:
          try {
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
          } catch (error) {
            console.error(`Tool call error: ${error}`);
            this.#cancelRun(threadId, run.id, runStatus.status);
            isProcessing = false;
          }
          break;
        case AssistantsRunStatus.EXPIRED:
        case AssistantsRunStatus.FAILED:
        case AssistantsRunStatus.CANCELLING:
        case AssistantsRunStatus.CANCELLED:
          console.log('Assistant run failed or expired.');
          isProcessing = false;
          return new ChatSendResVo({
            message: '抱歉剛恍神了，請稍後再試一次。',
            shoppingCart: await this.shoppingCartService.get(
              businessId,
              userId,
              userName,
            ),
          });
        case AssistantsRunStatus.IN_PROGRESS:
        case AssistantsRunStatus.QUEUED:
        default:
          break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const shoppingCart = await this.shoppingCartService.get(
      businessId,
      userId,
      userName,
    );

    if (loopCount >= this.sysConfigService.thirdParty.openaiLoopLimit) {
      console.error('OpenAI loop limit reached.');
      await this.clearRuns(threadId);
      return new ChatSendResVo({
        message: '我頭有點暈，請稍後再試一次。',
        shoppingCart: shoppingCart,
      });
    }

    const messages = await this.openai.beta.threads.messages.list(threadId);
    return new ChatSendResVo({
      message: messages.data[0].content[0].text.value,
      shoppingCart: shoppingCart,
    });
  }

  async clearRuns(threadId: string) {
    const runs = await this.openai.beta.threads.runs.list(threadId);
    for (const run of runs.data) {
      await this.#cancelRun(threadId, run.id, run.status);
    }
  }

  async #cancelRun(threadId: string, runId: string, status: string) {
    if (
      [
        AssistantsRunStatus.QUEUED.toString(),
        AssistantsRunStatus.IN_PROGRESS.toString(),
        AssistantsRunStatus.REQUIRES_ACTION.toString(),
      ].includes(status)
    )
      await this.openai.beta.threads.runs.cancel(threadId, runId);
  }

  //目前assistant api message role只支援user，暫時不能以system身分再疊加systemPrompt，先改用一個business_user一個Assistant的方式實作
  //TODO:建assistant response class
  async #getAssistant(businessId: string, name: string, systemPrompt: string) {
    const assistantList = await this.openai.beta.assistants.list();
    const assistantName = `${name}_${businessId}`;
    const functionCallingSConfig = JSON.parse(
      await this.githubService.getFunctionCallings(),
    );
    let businessAssistant = assistantList.data.filter(
      (x) => x.name === assistantName,
    );
    if (businessAssistant.length > 0) {
      //存在則更新sysPrompt
      await this.openai.beta.assistants.update(businessAssistant[0].id, {
        instructions: systemPrompt,
        tools: functionCallingSConfig,
      });
      return businessAssistant[0];
    } else {
      //不存在則建立
      businessAssistant = await this.openai.beta.assistants.create({
        name: assistantName,
        instructions: systemPrompt,
        tools: functionCallingSConfig,
        // model: 'gpt-4-1106-preview',
        model: this.sysConfigService.thirdParty.openaiModelId,
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

  async #toolCalls(
    runStatus: any,
    businessId: string,
    userId: string,
    userName: string,
  ) {
    const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
    const toolOutputs = [];

    for (const toolCall of toolCalls) {
      try {
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
            const recommandItems = await this.recommandService.getItem(
              businessId,
              userId,
            );

            if (recommandItems) {
              result = recommandItems.map((x) => {
                return { id: x.id, name: x.name };
              });
            }
            break;
          case 'get_order_history':
            const history = await this.orderService.getByUserId(
              userId,
              args.count,
            );

            if (history) {
              result = history.map((x) => {
                return { itemNames: x.detail.map((y) => y.itemName) };
              });
            }
            break;
          case 'get_all_items':
            const allItems = await this.menuItemService.getByBusinessId(
              businessId,
              args.count,
            );

            if (allItems) {
              result = allItems.map((x) => {
                return { id: x.id, name: x.name };
              });
            }
            break;
          case 'search_item_by_key':
            const matchedItem =
              await this.menuItemService.getItemModificationsByKey(
                businessId,
                args.key,
              );

            if (matchedItem) {
              result = matchedItem.map((x) => {
                return { id: x.id, name: x.name };
              });
            }
            break;
          case 'get_item_by_item_ids':
            const items =
              await this.menuItemService.getItemModificationsByItemIds(
                businessId,
                args.ids,
              );

            if (items) {
              result = items.map((x) => {
                const modifications = x.modifications.map((y) => {
                  return {
                    name: y.name,
                    minChoices: y.minChoices,
                    maxChoices: y.maxChoices,
                  };
                });

                return {
                  id: x.id,
                  name: x.name,
                  description: x.description,
                  price: x.price,
                  note: x.note,
                  modifications: modifications,
                };
              });
            }
            break;
          case 'get_shopping_cart':
            const shoppingCart = await this.shoppingCartService.get(
              businessId,
              userId,
              userName,
            );

            if (shoppingCart) {
              result = shoppingCart;
            }
            break;
          case 'modify_shopping_cart':
            const currentShoppingCart = await this.shoppingCartService.get(
              businessId,
              userId,
              userName,
            );
            //移除字串，AI給的錯誤資料
            args.detail = args.detail.filter((x) => typeof x !== 'string');

            //將既有購物車資料與新資料合併
            if (currentShoppingCart?.detail.length > 0) {
              args.detail = args.detail.concat(
                currentShoppingCart.detail.map((x) => {
                  return {
                    itemId: x.itemId,
                    count: x.count,
                    modifications: x.modifications,
                    memo: x.memo,
                  };
                }),
              );
            }

            result = await this.shoppingCartService.set(
              businessId,
              userId,
              userName,
              args,
            );
            break;
          case 'get_modification_by_item_id':
            const item =
              await this.menuItemService.getItemModificationsByItemIds(
                businessId,
                [args.id],
              );

            result = item[0].modifications.map((x) => {
              return {
                name: x.name,
                minChoices: x.minChoices,
                maxChoices: x.maxChoices,
                options: x.options,
              };
            });
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
      } catch (error) {
        console.error(`Tool call error: ${error}`);
        toolOutputs.push({
          tool_call_id: toolCall.id,
          output: 'Tool call error. please try again later.',
        });
      }
    }
    return toolOutputs;
  }
}
