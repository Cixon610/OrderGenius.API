import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Server, Socket } from 'socket.io';
import { ConnectionAuthVo, IUserPayload } from 'src/core/models';
import { SysConfigService } from 'src/infra/services';

@WebSocketGateway()
export class OrderNotifyGateway {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @WebSocketServer()
  server: Server;
  private clients: Map<string, Socket> = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const auth: ConnectionAuthVo = this.#GetAuthFromJWT(client);
      const isValid = await this.#validateClient(auth);
      if (!isValid) {
        client.disconnect();
        return;
      }

      const roomName = this.#getRoomNameFromAuth(auth.businessId);
      await client.join(roomName);
      this.clients.set(auth.userId, client);
      console.log(`Client connected: ${auth.userId}`);
      client.emit('joinedRoom', {
        roomName,
        message: 'Successfully joined the room.',
      });
    } catch (error) {
      console.log('Error in handleConnection:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const auth: ConnectionAuthVo = this.#GetAuthFromJWT(client);
    this.clients.delete(auth.userId);
    //TODO: 通知其他用戶，如果未來有群組在線功能才需要
    // client
    //   .to(roomName)
    //   .emit('userDisconnected', {
    //     userId: auth.userId,
    //     message: 'User has disconnected.',
    //   });
    console.log(`Client disconnected: ${auth.userId}`);
  }

  // @SubscribeMessage('orderNotification')
  handleOrderCreated(@MessageBody() data: any) {
    const { businessId, OrderId } = data;
    const roomName = this.#getRoomNameFromAuth(businessId);
    this.server.to(roomName).emit('orderNotification', OrderId);
  }

  test(businessId: string, userId: string, timestamp: number) {
    const signaturePayload = `${businessId}_${userId}_${timestamp}`;
    const signature = crypto
      .createHmac('sha256', 'OrderGPT')
      .update(signaturePayload)
      .digest('hex');
  }
  async #validateClient(auth: ConnectionAuthVo): Promise<boolean> {
    // return true;
    const jwtDecoded = jwt.verify(
      auth.jwtToken,
      this.sysConfigService.infra.jwtSecret,
    ) as IUserPayload;
    const currentTime = Math.floor(Date.now() / 1000); // 取得當前時間的 Unix 時間戳

    if (jwtDecoded.id !== auth.userId) {
      console.log('[validateClient] Invalid userId');
      return false;
    }
    if (jwtDecoded.businessId !== auth.businessId) {
      console.log('[validateClient] Invalid businessId');
      return false;
    }

    const requestTimestamp = auth.timestamp;
    const maxAllowedTimeDifference = 300; // 5 分鐘 (300 秒)
    if (currentTime - requestTimestamp > maxAllowedTimeDifference) {
      console.log('[validateClient] Invalid request timestamp');
      return false;
    }

    const signaturePayload = `${jwtDecoded.businessId}_${jwtDecoded.id}_${auth.timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.sysConfigService.infra.jwtSecret)
      .update(signaturePayload)
      .digest('hex');
    if (signature !== auth.signature) {
      console.log('[validateClient] Invalid signature');
      return false;
    }

    return true;
  }

  #getRoomNameFromAuth(businessId: string): string {
    return `Room-${businessId}`;
  }

  #GetAuthFromJWT(client: Socket): ConnectionAuthVo {
    const timestamp = Number(client.handshake.headers?.timestamp);
    if (!timestamp) {
      throw new Error('Invalid timestamp');
    }
    const signature = client.handshake.headers?.signature.toString();
    if (!signature) {
      throw new Error('Invalid signature');
    }
    const token = client.handshake.headers?.token.toString();
    if (!token) {
      throw new Error('Invalid token');
    }
    const rawAuth = jwt.decode(token) as IUserPayload;
    const auth: ConnectionAuthVo = {
      jwtToken: token,
      userId: rawAuth.id,
      businessId: rawAuth.businessId,
      timestamp: timestamp,
      signature: signature,
    };
    return auth;
  }
}
