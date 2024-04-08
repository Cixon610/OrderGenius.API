import { Injectable } from '@nestjs/common';
import { LLMBaseServiceService } from '../llm.base.service/llm.base.service.service';
import { RedisService, SysConfigService } from 'src/infra/services';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
//   implements ILLMService
export class OpenaiService extends LLMBaseServiceService {
  constructor(
    protected readonly sysConfigService: SysConfigService,
    private readonly redisService: RedisService,
  ) {
    super(sysConfigService);
  }

  async *call(
    sessionId: string,
    systemPrompt: string,
    content: string,
    functionSchema: string = null,
  ): AsyncGenerator<string> {
    let llm = new ChatOpenAI({
      openAIApiKey: this.sysConfigService.thirdParty.opeanaiApiKey,
      temperature: 0.9,
      modelName: 'gpt-4',
      maxTokens: 500,
      streaming: true,
      // TODO: prefixMessages沒效果，待研究
      //   prefixMessages: [
      //     {
      //       role: 'system',
      //       content: systemPrompt,
      //     },
      //   ],
    });

    content = !!content ? content : systemPrompt;
    this.redisService.addToList(
      sessionId,
      JSON.stringify({ role: 'human', content, timestamp: new Date() }),
    );

    const msghistoryParams = [];
    const msghistory = await this.redisService.getList(sessionId);
    msghistory.forEach((msg) => {
      const { role, content } = JSON.parse(msg);
      msghistoryParams.push([role, content]);
    });

    functionSchema &&
      llm.bind({
        tools: JSON.parse(functionSchema),
        tool_choice: 'auto',
      });
    const stream = await llm.stream(msghistoryParams);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk.content);
      yield `${chunk.content}`;
    }
    this.redisService.addToList(
      sessionId,
      JSON.stringify({ role: 'ai', content: chunks.join('') }),
    );
  }
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
