import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const requestId = randomUUID();
    const startAt = process.hrtime(); // 記錄一個時間戳

    this.logger.log(
      `Request[${requestId}] started: ${method} ${url} - ${userAgent} ${ip}`,
    ); // 記錄request進來的日誌

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const diff = process.hrtime(startAt);
      const time = diff[0] * 1e3 + diff[1] * 1e-6; // 計算花費的時間

      this.logger.log(
        `Request[${requestId}] finished: ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${time.toFixed(
          3,
        )}ms`,
      ); // 記錄response完成的日誌，包含花費的時間
    });

    next();
  }
}
