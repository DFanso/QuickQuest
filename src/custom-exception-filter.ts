import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(InternalServerErrorException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestID = response.get('X-Request-ID');
    const status = exception?.getStatus ? exception.getStatus() : 500;
    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        process.env.NODE_ENV === 'development'
          ? exception.message
          : 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: exception.stack }),
    };
    this.logger.error(
      `${requestID} - ${request.method} ${request.url} ${exception?.message} ${exception?.stack}`,
    );

    response.status(status).json(errorResponse);
  }
}
