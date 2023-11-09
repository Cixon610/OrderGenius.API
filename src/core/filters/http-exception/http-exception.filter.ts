import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(Error)
export class HttpExceptionFilter<T> implements ExceptionFilter {
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

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp,
    });
  }
}
