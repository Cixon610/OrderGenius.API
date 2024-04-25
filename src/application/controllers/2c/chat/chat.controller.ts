import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Sse,
  UseGuards,
  MessageEvent,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable, Subject, from, interval, map, mergeMap, of } from 'rxjs';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import {
  ChatCreateResVo,
  ChatSendReqVo,
  ChatSendResVo,
  ChatSendV2ReqVo,
  ChatSendV2ResVo,
} from 'src/core/models';
import { ChatService, OpenaiAgentService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly OpenaiAgentService: OpenaiAgentService,
    private readonly chatService: ChatService,
  ) {}
  //#region V1 Asisstant api
  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ChatCreateResVo })
  async Create(
    @Query('businessId') businessId: string,
    @Req() req,
    @Res() res,
  ) {
    const result = await this.OpenaiAgentService.createChat(
      businessId,
      req.user.id,
    );
    res.json(result);
  }

  @Post('send')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ChatSendResVo })
  async Send(@Req() req, @Body() chatSendReqVo: ChatSendReqVo, @Res() res) {
    console.debug('chatSendReqVo', chatSendReqVo);
    const result = await this.OpenaiAgentService.sendChat(
      chatSendReqVo.assistantId,
      chatSendReqVo.threadId,
      chatSendReqVo.content,
      chatSendReqVo.businessId,
      req.user.id,
      req.user.username,
    );

    console.debug('result', result);
    res.json(result);
  }

  @Post('clearRuns')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async ClearRuns(@Query('threadId') threadId: string, @Res() res) {
    await this.OpenaiAgentService.clearRuns(threadId);
    res.json(true);
  }
  //#endregion

  //#region V2 SSE
  @Get('/v2')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ChatSendV2ResVo, description: 'sessionId' })
  async CreateV2(
    @Query('businessId') businessId: string,
    @Req() req,
    @Res() res,
  ) {
    const result = await this.chatService.create(businessId, req.user.id);
    res.json(result);
  }

  @Post('/v2/send/sse')
  @Sse()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Observable<MessageEvent> })
  async SendSSE(
    @Req() req,
    @Body() chatSendReqVo: ChatSendV2ReqVo,
  ): Promise<Observable<MessageEvent>> {
    const stream = await this.chatService.call(
      chatSendReqVo.businessId,
      req.user.id,
      req.user.username,
      chatSendReqVo.sessionId,
      chatSendReqVo.content,
    );

    return from(stream).pipe(map((data) => ({ data })));
  }
  //#endregion
}
