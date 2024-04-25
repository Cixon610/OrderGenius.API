import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { LLMBaseServiceService } from '../llm.base.service/llm.base.service.service';
import { RedisService, SysConfigService } from 'src/infra/services';
import { ChatSendDto } from 'src/core/models';
import { ToolCallsService } from '../tool.calls/tool.calls.service';
import { jsonrepair } from 'jsonrepair';

@Injectable()
//   implements ILLMService
export class OpenaiService extends LLMBaseServiceService {
  constructor(
    protected readonly sysConfigService: SysConfigService,
    protected readonly toolCallsService: ToolCallsService,
    private readonly redisService: RedisService,
  ) {
    super(sysConfigService);
  }
  async createChat(sessionId: string, systemPrompt: string) {
    await this.redisService.addToList(
      sessionId,
      JSON.stringify({
        role: 'system',
        content: systemPrompt,
        timestamp: new Date(),
      }),
    );
  }

  async *sendChat(
    businessId: string,
    userId: string,
    userName: string,
    sessionId: string,
    content: string,
    functionSchema: any[] = null,
  ): AsyncGenerator<ChatSendDto> {
    const openai = new OpenAI({
      apiKey: this.sysConfigService.thirdParty.opeanaiApiKey,
    });

    if (content) {
      await this.redisService.addToList(
        sessionId,
        JSON.stringify({ role: 'user', content, timestamp: new Date() }),
      );
    }

    const messages = await this.getMessages(sessionId);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages,
      tools: functionSchema,
      tool_choice: 'auto',
      stream: true,
    });

    const messageChunks = [];
    const toolCallInfos = [];
    // const availableFunctions = {
    //   get_recommand: this.toolCallsService.getRecommand,
    //   get_order_history: this.toolCallsService.getOrderHistory,
    //   get_all_items: this.toolCallsService.getAllItems,
    //   search_item_by_key: this.toolCallsService.searchItemByKey,
    //   get_item_by_item_ids: this.toolCallsService.getItemByItemIds,
    //   get_shopping_cart: this.toolCallsService.getShoppingCart,
    //   modify_shopping_cart: this.toolCallsService.modifyShoppingCart,
    //   get_modification_by_item_id: this.toolCallsService.getModificationByItemId,
    // };

    // const availableFunctions = {
    //   get_weather: this.getWeather,
    //   get_time: this.getTime,
    // };

    //streaming
    for await (const chunk of completion) {
      console.log(JSON.stringify(chunk));
      const message = chunk.choices[0].delta.content;
      const toolCalls = chunk.choices[0].delta.tool_calls;

      //funtion call
      if (toolCalls) {
        const toolCall = toolCalls[0];
        if (toolCall.function.name) {
          toolCallInfos.push(toolCall);
        } else {
          const lastToolCall = toolCallInfos[toolCallInfos.length - 1];
          if (toolCall.function.arguments) {
            lastToolCall.function.arguments += toolCall.function.arguments;
          }
        }
      }
      //normal message
      else {
        //remove empty message
        if (!message) continue;

        messageChunks.push(chunk.choices[0].delta.content);
        yield new ChatSendDto({
          type: 'message',
          content: `${chunk.choices[0].delta.content}`,
        });
      }
    }

    if (toolCallInfos.length > 0) {
      //store ai tool call
      await this.redisService.addToList(
        sessionId,
        JSON.stringify({
          tool_calls: toolCallInfos,
          role: 'assistant',
          content: null,
          timestamp: new Date(),
        }),
      );
      for (const toolCallInfo of toolCallInfos) {
        //fix json argument
        if (toolCallInfo.function.arguments) {
          toolCallInfo.function.arguments = JSON.parse(
            jsonrepair(toolCallInfo.function.arguments),
          );
        }
        // const result = availableFunctions[toolCallInfo.function.name](
        //   ...toolCallInfo.function.arguments,
        // );
        let result = null;
        const args = toolCallInfo.function.arguments;
        switch (toolCallInfo.function.name) {
          case 'get_recommand':
            result = await this.toolCallsService.getRecommand(
              businessId,
              userId,
            );
            break;
          case 'get_order_history':
            result = await this.toolCallsService.getOrderHistory(
              userId,
              args?.count,
            );
            break;
          case 'get_all_items':
            result = await this.toolCallsService.getAllItems(
              businessId,
              args?.count,
            );
            break;
          case 'search_item_by_key':
            result = await this.toolCallsService.searchItemByKey(
              businessId,
              args?.key,
            );
            break;
          case 'get_item_by_item_ids':
            result = await this.toolCallsService.getItemByItemIds(
              businessId,
              args?.ids,
            );
            break;
          case 'get_shopping_cart':
            result = await this.toolCallsService.getShoppingCart(
              businessId,
              userId,
              userName,
            );
            break;
          case 'modify_shopping_cart':
            result = await this.toolCallsService.modifyShoppingCart(
              businessId,
              userId,
              userName,
              args,
            );
            break;
          case 'get_modification_by_item_id':
            result = await this.toolCallsService.getModificationByItemId(
              businessId,
              args?.id,
            );
            break;
        }

        //store tool call result
        await this.redisService.addToList(
          sessionId,
          JSON.stringify({
            tool_call_id: toolCallInfo.id,
            role: 'tool',
            content: JSON.stringify(result),
            timestamp: new Date(),
          }),
        );
      }

      yield new ChatSendDto({
        type: 'tool_call',
      });
    } else {
      await this.redisService.addToList(
        sessionId,
        JSON.stringify({ role: 'assistant', content: messageChunks.join('') }),
      );
    }
  }

  private async getMessages(sessionId: string): Promise<any> {
    const msghistory = await this.redisService.getList(sessionId);
    return msghistory.map((msg) => {
      const json = JSON.parse(msg);
      delete json.timestamp;
      return json;
    });
  }

  //TEST
  // getWeather(place) {
  //   return `The weather in ${place} is 72 degrees and sunny.`;
  // }
  // getTime(UTC) {
  //   return Date.now();
  // }

  //#region LangChain mode
  // async *call(
  //   sessionId: string,
  //   content: string,
  //   functionSchema: string = null,
  // ): AsyncGenerator<string> {
  //   let llm = new ChatOpenAI({
  //     openAIApiKey: this.sysConfigService.thirdParty.opeanaiApiKey,
  //     temperature: 0.9,
  //     modelName: 'gpt-4',
  //     maxTokens: 500,
  //     streaming: true,
  //     // TODO: prefixMessages沒效果，待研究
  //     //   prefixMessages: [
  //     //     {
  //     //       role: 'system',
  //     //       content: systemPrompt,
  //     //     },
  //     //   ],
  //   });

  //   this.redisService.addToList(
  //     sessionId,
  //     JSON.stringify({ role: 'human', content, timestamp: new Date() }),
  //   );

  //   const msghistoryParams = [];
  //   const msghistory = await this.redisService.getList(sessionId);
  //   msghistory.forEach((msg) => {
  //     const { role, content } = JSON.parse(msg);
  //     msghistoryParams.push([role, content]);
  //   });

  //   functionSchema &&
  //     llm.bind({
  //       tools: JSON.parse(functionSchema),
  //       tool_choice: 'auto',
  //     });
  //   const stream = await llm.stream(msghistoryParams);
  //   const chunks = [];
  //   for await (const chunk of stream) {
  //     chunks.push(chunk.content);
  //     yield `${chunk.content}`;
  //   }
  //   this.redisService.addToList(
  //     sessionId,
  //     JSON.stringify({ role: 'ai', content: chunks.join('') }),
  //   );
  // }
  //#endregion
}
//#region ConversationChain沒辦法用streaming，待研究
//   async call(
//     sessionId: string,
//     systemPrompt: string,
//     content: string,
//     functionSchema: string = null,
//     callback: any = null,
//   ): Promise<IterableReadableStream<ChainValues>> {
//     const memory = this.createRedisMemory(sessionId);
//     let llm = new ChatOpenAI({
//       openAIApiKey: this.sysConfigService.thirdParty.opeanaiApiKey,
//       temperature: 0.9,
//       modelName: 'gpt-4',
//       maxTokens: 500,
//       streaming: true,
//       //   prefixMessages: [
//       //     {
//       //       role: 'system',
//       //       content: systemPrompt,
//       //     },
//       //   ],
//     });
//     const stream = await llm.stream(systemPrompt );
//     const chunks = [];
//     for await (const chunk of stream) {
//       chunks.push(chunk);
//       console.log(`${chunk.content}|`);
//     }
//     // functionSchema &&
//     //   llm.bind({
//     //     tools: JSON.parse(functionSchema),
//     //     tool_choice: 'auto',
//     //   });
//     // llm.pipe(new StringOutputParser());

//     const chain = new ConversationChain({
//       llm,
//       memory,
//     //   verbose: false,
//       callbacks: [
//         {
//           handleLLMNewToken(token: string) {
//             console.log({ token });
//           },
//         },
//       ],
//     });

//     const input = !!content ? content : systemPrompt;
//     return await chain.stream({ input });
//   }
// #endregion
