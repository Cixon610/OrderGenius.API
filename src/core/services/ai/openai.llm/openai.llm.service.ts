import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { RedisService, SysConfigService } from 'src/infra/services';
import {
  ChatCreateResVo,
  ChatSendDto,
  ChatStreamResVo,
  LlmChatSendDto,
} from 'src/core/models';
import { ToolCallsService } from '../tool.calls/tool.calls.service';
import { jsonrepair } from 'jsonrepair';
import { randomUUID } from 'crypto';
import { ILLMService } from 'src/core/models/interface/llm.service.interface';
import { ChatStreamRes } from 'src/core/constants/enums/chat.stream.res.enum';

@Injectable()
export class OpenaiLlmService implements ILLMService {
  protected openai: OpenAI;
  constructor(
    protected readonly sysConfigService: SysConfigService,
    protected readonly toolCallsService: ToolCallsService,
    private readonly redisService: RedisService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.sysConfigService.thirdParty.opeanaiApiKey,
    });
  }

  async createChat(
    businessId: string,
    userId: string,
    systemPrompt: string,
  ): Promise<ChatCreateResVo> {
    const threadId = randomUUID();
    const redisKey = this.#getRedisKey(businessId, userId, threadId);
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
      threadId,
    });
  }

  async *sendChat(dto: LlmChatSendDto): AsyncGenerator<ChatStreamResVo> {
    let continueChat = true;
    while (continueChat) {
      for await (const chatdto of this.call(dto)) {
        //看要不要回圈3次後就跳出，避免LLM一直tool call導致使用者一直等待
        switch (chatdto.type) {
          case 'message':
            yield new ChatStreamResVo({
              type: ChatStreamRes.MESSAGE,
              content: chatdto.content,
            });

            continueChat = false;
            break;
          case 'tool_call':
            //tool call重打一次，因已將tool call的結果存入redis，所以清空content
            dto.content = '';
            continue;
          default:
            break;
        }
      }
    }
  }

  async *call(dto: LlmChatSendDto): AsyncGenerator<ChatSendDto> {
    const redisKey = this.#getRedisKey(
      dto.businessId,
      dto.userId,
      dto.threadId,
    );

    if (dto.content) {
      await this.redisService.addToList(
        redisKey,
        JSON.stringify({
          role: 'user',
          content: dto.content,
          timestamp: new Date(),
        }),
      );
    }

    const messages = await this.#getMessages(redisKey);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages,
      tools: dto.toolcalls,
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
          dto.businessId,
          dto.userId,
          dto.userName,
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

  #getRedisKey(businessId: string, userId: string, sessionId: string): string {
    return `chat:${businessId}:${userId}:${sessionId}`;
  }

  async #getMessages(redisKey: string): Promise<any> {
    const msghistory = await this.redisService.getList(redisKey);
    return msghistory.map((msg) => {
      const json = JSON.parse(msg);
      delete json.timestamp;
      return json;
    });
  }
}
