import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(Error)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx?.getResponse();
    let status = exception instanceof HttpException 
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
      
    const message = exception?.message || 'Internal server error';
    const timestamp = new Date().toISOString();

    response.status(status).json({
      statusCode: status,
      message,
      timestamp,
    });
  }
}
