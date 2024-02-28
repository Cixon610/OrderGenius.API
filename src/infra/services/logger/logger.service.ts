import { Exceptionless } from '@exceptionless/node';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new Logger('HTTP');

  async Info(message: string, obj: any = null): Promise<void> {
    const event = await Exceptionless.createLog(message, 'Info');
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          event.setProperty(key, obj[key]);
        }
      }
    }
    this.logger.log(`${message}, obj: ${JSON.stringify(obj)}`);

    await event.submit();
  }

  async Error(message: string, obj: any): Promise<void> {
    const event = await Exceptionless.createLog(message, 'Error');

    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          event.setProperty(key, obj[key]);
        }
      }
    }
    this.logger.error(`${message}, obj: ${JSON.stringify(obj)}`);

    await event.submit();
  }
}
