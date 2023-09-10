import {
  Controller,
  Get,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { stringify } from 'qs';
import { LineService } from 'src/core/services';

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}
@ApiTags('line')
@Controller('line')
export class LineController {
  private readonly channelId = process.env.LINE_CHANNEL_ID;
  private readonly channelSecret = process.env.LINE_CHANNEL_SECRET;
  private readonly callbackUrl = process.env.CLIENT_URL;

  constructor(private readonly userService: LineService) {}

  @Get('login')
  async login(@Req() req, @Res() res) {
    const state = randomBytes(16).toString('hex');
    const nonce = randomBytes(16).toString('hex');
    const queryParams = stringify({
      response_type: 'code',
      client_id: this.channelId,
      redirect_uri: this.callbackUrl,
      state,
      scope: 'openid profile',
      nonce,
    });
    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${queryParams}`;

    res.json({ data: { url: loginUrl } });
  }

  @Get('callback')
  @UsePipes(ValidationPipe)
  async callback(@Req() req, @Res() res) {
    try {
      const { code } = req.query;
      const tokenResponse = await axios.post(
        'https://api.line.me/oauth2/v2.1/token',
        {
          grant_type: 'authorization_code',
          code,
          client_id: this.channelId,
          client_secret: this.channelSecret,
          redirect_uri: this.callbackUrl,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      const { access_token } = tokenResponse.data;

      const profileResponse = await axios.get(
        'https://api.line.me/v2/profile',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const profile: LineProfile = profileResponse.data;
      const { userId, displayName, pictureUrl, statusMessage } = profile;

      const user = await this.userService.findLineAccountByLineId(userId);
      if (!user) {
        await this.userService.createLineAccount({
          lineId: userId,
          displayName: displayName,
          pictureUrl: pictureUrl,
          statusMessage: statusMessage,
          userId: userId,
          creationTime: new Date(),
          updateTime: new Date(),
        });
      }

      res.json({ data: profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}
