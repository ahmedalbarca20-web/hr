import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'حدث خطأ داخلي في الخادم';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any)?.message || exception.message;
    } else if (exception instanceof Error) {
      // Handle Supabase / DB errors
      const err = exception as any;
      if (err?.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'البيانات موجودة مسبقاً';
      } else if (err?.code === '23503') {
        status = HttpStatus.BAD_REQUEST;
        message = 'مرجع غير صالح - تحقق من البيانات المرتبطة';
      } else if (err?.code === '42501') {
        status = HttpStatus.FORBIDDEN;
        message = 'ليس لديك صلاحية للقيام بهذه العملية';
      } else {
        message = exception.message || 'حدث خطأ غير متوقع';
      }
    }

    this.logger.error(
      `${request.method} ${request.url} → ${status}: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
