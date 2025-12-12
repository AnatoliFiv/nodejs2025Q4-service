import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevel: number;

  constructor() {
    this.logLevel = parseInt(process.env.LOG_LEVEL || '2', 10);
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(0)) {
      this.writeLog('ERROR', message, context, trace);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(1)) {
      this.writeLog('WARN', message, context);
    }
  }

  log(message: string, context?: string) {
    if (this.shouldLog(2)) {
      this.writeLog('LOG', message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(3)) {
      this.writeLog('DEBUG', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog(4)) {
      this.writeLog('VERBOSE', message, context);
    }
  }

  private shouldLog(level: number): boolean {
    return level <= this.logLevel;
  }

  private writeLog(
    level: string,
    message: string,
    context?: string,
    trace?: string,
  ): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const logMessage = `[${timestamp}] [${level}] ${contextStr} ${message}`;

    process.stdout.write(logMessage + '\n');

    if (trace) {
      process.stdout.write(trace + '\n');
    }
  }
}
