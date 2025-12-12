import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { url, method, query, body } = request;

    try {
      const sanitizedBody = this.sanitizeBody(body);
      const queryStr = this.safeStringify(query);
      const bodyStr = this.safeStringify(sanitizedBody);

      this.loggingService.log(
        `Incoming Request: ${method} ${url} | Query: ${queryStr} | Body: ${bodyStr}`,
        'HTTP',
      );
    } catch (error) {
      this.loggingService.error(
        `Failed to log request: ${method} ${url}`,
        error instanceof Error ? error.stack : String(error),
        'HTTP',
      );
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          this.loggingService.log(
            `Outgoing Response: ${method} ${url} | Status: ${response.statusCode}`,
            'HTTP',
          );
        },
        error: (error: unknown) => {
          const response = context.switchToHttp().getResponse<Response>();
          this.loggingService.error(
            `Outgoing Response: ${method} ${url} | Status: ${response.statusCode || 500}`,
            error instanceof Error ? error.stack : String(error),
            'HTTP',
          );
        },
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...(body as Record<string, unknown>) };

    const sensitiveFields = [
      'password',
      'refreshToken',
      'oldPassword',
      'newPassword',
    ];
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }

  private safeStringify(obj: unknown, maxLength = 10000): string {
    try {
      if (obj === null || obj === undefined) {
        return String(obj);
      }
      if (typeof obj === 'object' && Object.keys(obj).length === 0) {
        return 'null';
      }

      const seen = new WeakSet();
      const str = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      });

      if (str.length > maxLength) {
        return str.substring(0, maxLength) + '... [truncated]';
      }

      return str;
    } catch (error) {
      return '[Unable to stringify: ' + String(error) + ']';
    }
  }
}
