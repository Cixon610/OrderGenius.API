import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { ChatCreateResVo, ChatSendReqVo, ChatSendResVo } from 'src/core/models';
import { OpenaiService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ChatCreateResVo })
  async Create(
    @Query('businessId') businessId: string,
    @Req() req,
    @Res() res,
  ) {
    const result = await this.openaiService.createChat(businessId, req.user.id);
    res.json(result);
  }

  @Post('send')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ChatSendResVo })
  async Send(@Req() req, @Body() chatSendReqVo: ChatSendReqVo, @Res() res) {
    const result = await this.openaiService.sendChat(
      chatSendReqVo.assistantId,
      chatSendReqVo.threadId,
      chatSendReqVo.content,
      chatSendReqVo.businessId,
      req.user.id,
      req.user.username,
    );

    res.json(result);
  }

  @Post('clearRuns')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async ClearRuns(@Query('threadId') threadId: string, @Res() res) {
    await this.openaiService.clearRuns(threadId);
    res.json(true);
  }
}
