import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatCreateReqVo, ChatSendReqVo } from 'src/core/models';
import { OpenaiService } from 'src/core/services';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('create')
  // @ApiBearerAuth()
  // @ApiResponse({ status: 200, type: BusinessResVo })
  async Create(@Body()chatCreateReqVo: ChatCreateReqVo, @Res() res) {
    const result = await this.openaiService.createChat(
      chatCreateReqVo.businessId,
      chatCreateReqVo.userId,
    );
    res.json(result);
  }

  @Post('send')
  // @ApiBearerAuth()
  // @ApiResponse({ status: 200, type: BusinessResVo })
  async Send(@Body()chatSendReqVo: ChatSendReqVo, @Res() res) {
    const result = await this.openaiService.sendChat(
      chatSendReqVo.assistantId,
      chatSendReqVo.threadId,
      chatSendReqVo.content,
    );
    
    res.json(result);
  }
}
