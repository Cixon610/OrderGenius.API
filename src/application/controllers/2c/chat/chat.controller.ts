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
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { Observable, catchError, from, map, of } from 'rxjs';
import { ChatSendReqVo, ChatSendV2ResVo } from 'src/core/models';
import { ChatService, OpenaiAgentService } from 'src/core/services';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatTypeEnum } from 'src/core/constants/enums/chat.type.enum';
import { ChatProviderEnum } from 'src/core/constants/enums/chat.provider.enum';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly OpenaiAgentService: OpenaiAgentService,
    private readonly chatService: ChatService,
  ) {}

  @Get(':provider/:type')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ChatSendV2ResVo, description: 'sessionId' })
  async CreateV2(
    @Param('provider') provider: ChatProviderEnum,
    @Param('type') type: ChatTypeEnum,
    @Query('businessId') businessId: string,
    @Req() req,
    @Res() res,
  ) {
    const result = await this.chatService.create(
      provider,
      type,
      businessId,
      req.user.id,
    );
    res.json(result);
  }

  @Post(':provider/:type/send')
  @Sse()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Observable<MessageEvent> })
  async SendSSE(
    @Param('provider') provider: ChatProviderEnum,
    @Param('type') type: ChatTypeEnum,
    @Req() req,
    @Body() chatSendReqVo: ChatSendReqVo,
  ): Promise<Observable<MessageEvent>> {
    try {
      const stream = await this.chatService.call(
        provider,
        type,
        chatSendReqVo.businessId,
        req.user.id,
        req.user.username,
        chatSendReqVo.threadId,
        chatSendReqVo.content,
      );

      return from(stream).pipe(
        map((data) => ({ data })),
        catchError((error) => of({ data: `Error: ${error.message}` })),
      );
    } catch (error) {
      return of({ data: `Error: ${error.message}` });
    }
  }

  @Post(':provider/:type/clear-runs')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async ClearRuns(
    @Param('provider') provider: ChatProviderEnum,
    @Param('type') type: ChatTypeEnum,
    @Query('threadId') threadId: string,
    @Res() res,
  ) {
    await this.OpenaiAgentService.clearRuns(threadId);
    res.json(true);
  }
}
