import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = null;

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || exception.message;
        details = exceptionResponse['details'] || null;
      } else {
        message = exceptionResponse as string;
      }
    } 
    // Handle database errors
    else if (exception && typeof exception === 'object' && 'code' in exception) {
      const dbError = exception as any;
      
      // Handle unique constraint violations
      if (dbError.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry';
        details = {
          constraint: dbError.constraint,
          detail: dbError.detail,
        };
      }
      // Handle foreign key violations
      else if (dbError.code === '23503') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Referenced entity does not exist';
        details = {
          constraint: dbError.constraint,
          detail: dbError.detail,
        };
      }
      // Handle not null violations
      else if (dbError.code === '23502') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Required field is missing';
        details = {
          column: dbError.column,
          detail: dbError.detail,
        };
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    });
  }
} 