import { Injectable } from '@nestjs/common';
import { SysConfigService } from '../config/sys.config.service';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai;
  constructor(private readonly SysConfigService: SysConfigService) {
    this.openai = new OpenAI({
      apiKey: SysConfigService.thirdParty.opeanaiApiKey,
    });
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
