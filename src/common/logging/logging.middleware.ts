import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = req;

    try {
      const sanitizedBody = this.sanitizeBody(body);
      const queryStr = this.safeStringify(query);
      const bodyStr = this.safeStringify(sanitizedBody);

      this.loggingService.log(
        `Incoming Request: ${method} ${originalUrl} | Query: ${queryStr} | Body: ${bodyStr}`,
        'HTTP',
      );
    } catch (error) {
      this.loggingService.error(
        `Failed to log request: ${method} ${originalUrl}`,
        error instanceof Error ? error.stack : String(error),
        'HTTP',
      );
    }

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      if (statusCode >= 400) {
        this.loggingService.warn(
          `Outgoing Response: ${method} ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms`,
          'HTTP',
        );
      } else {
        this.loggingService.log(
          `Outgoing Response: ${method} ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms`,
          'HTTP',
        );
      }
    });

    res.on('close', () => {
      if (!res.writableEnded) {
        const duration = Date.now() - startTime;
        this.loggingService.warn(
          `Outgoing Response: ${method} ${originalUrl} | Status: ${res.statusCode || 'N/A'} | Connection closed | Duration: ${duration}ms`,
          'HTTP',
        );
      }
    });

    next();
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
