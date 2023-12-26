import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenaiService } from 'src/infra/services';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  async Add() {
    this.openaiService.assistantTest();
  }
}
