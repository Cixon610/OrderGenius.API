import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { LLMBaseServiceService } from '../llm.base.service/llm.base.service.service';
import { RedisService, SysConfigService } from 'src/infra/services';
import { ChatCreateResVo, ChatSendDto } from 'src/core/models';
import { ToolCallsService } from '../tool.calls/tool.calls.service';
import { jsonrepair } from 'jsonrepair';
import { randomUUID } from 'crypto';

@Injectable()
//   implements ILLMService
export class OpenaiService extends LLMBaseServiceService {
  private readonly openai: OpenAI;
  constructor(
    protected readonly sysConfigService: SysConfigService,
    protected readonly toolCallsService: ToolCallsService,
    private readonly redisService: RedisService,
  ) {
    super(sysConfigService);
    this.openai = new OpenAI({
      apiKey: this.sysConfigService.thirdParty.opeanaiApiKey,
    });
  }
  async createChat(
    businessId: string,
    userId: string,
    systemPrompt: string,
  ): Promise<ChatCreateResVo> {
    const sessionId = randomUUID();
    const redisKey = `chat:${businessId}:${userId}:${sessionId}`;
    await this.redisService.addToList(
      redisKey,
      JSON.stringify({
        role: 'system',
        content: systemPrompt,
        timestamp: new Date(),
      }),
    );

    return new ChatCreateResVo({
      businessId,
      threadId: sessionId,
    });
  }

  async *sendChat(
    businessId: string,
    userId: string,
    userName: string,
    sessionId: string,
    content: string,
    functionSchema: any[] = null,
  ): AsyncGenerator<ChatSendDto> {
    const redisKey = `chat:${businessId}:${userId}:${sessionId}`;

    if (content) {
      await this.redisService.addToList(
        redisKey,
        JSON.stringify({ role: 'user', content, timestamp: new Date() }),
      );
    }

    const messages = await this.getMessages(redisKey);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages,
      tools: functionSchema,
      tool_choice: 'auto',
      stream: true,
    });

    const messageChunks = [];
    const toolCallInfos = [];

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
        redisKey,
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
        let result = await this.toolCallsService.processToolCall(
          toolCallInfo,
          businessId,
          userId,
          userName,
        );

        //store tool call result
        await this.redisService.addToList(
          redisKey,
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
        redisKey,
        JSON.stringify({ role: 'assistant', content: messageChunks.join('') }),
      );
    }
  }

  private async getMessages(redisKey: string): Promise<any> {
    const msghistory = await this.redisService.getList(redisKey);
    return msghistory.map((msg) => {
      const json = JSON.parse(msg);
      delete json.timestamp;
      return json;
    });
  }
}
