import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenaiService } from 'src/infra/services';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  async Add() {
    this.openaiService.assistantTest();
  }
}
