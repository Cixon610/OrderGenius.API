import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from 'src/infra/services/logger/logger.service';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx?.getResponse();
    const timestamp = new Date().toISOString();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = [exception.message ?? 'Internal server error'];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const msgRes = exception.getResponse();

      //Get validatePipe messages
      if (!!msgRes['message']) {
        message = msgRes['message'];
      }
    }

    console.error(exception);
    this.logger.Error(exception.message, exception);
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp,
    });
  }
}
