import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevel: number;
  private readonly maxFileSizeKB: number;
  private readonly maxBackups: number;
  private readonly logDir: string;
  private readonly applicationLogFile: string;
  private readonly errorLogFile: string;

  constructor() {
    this.logLevel = parseInt(process.env.LOG_LEVEL || '2', 10);
    this.maxFileSizeKB = parseInt(
      process.env.LOG_MAX_FILE_SIZE_KB || '1024',
      10,
    );
    this.maxBackups = parseInt(process.env.LOG_MAX_BACKUPS || '5', 10);
    this.logDir = path.join(process.cwd(), 'logs');
    this.applicationLogFile = path.join(this.logDir, 'application.log');
    this.errorLogFile = path.join(this.logDir, 'errors.log');

    this.ensureLogDirectory();
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
    const fullLogMessage = trace
      ? `${logMessage}\n${trace}\n`
      : `${logMessage}\n`;

    process.stdout.write(logMessage + '\n');

    if (trace) {
      process.stdout.write(trace + '\n');
    }

    this.writeToFile(this.applicationLogFile, fullLogMessage);

    if (level === 'ERROR') {
      this.writeToFile(this.errorLogFile, fullLogMessage);
    }
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeToFile(filePath: string, message: string): void {
    try {
      this.ensureLogDirectory();

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const fileSizeKB = stats.size / 1024;

        if (fileSizeKB >= this.maxFileSizeKB) {
          this.rotateLogFile(filePath);
        }
      }

      fs.appendFileSync(filePath, message, 'utf8');
    } catch (error) {
      process.stderr.write(
        `Failed to write to log file ${filePath}: ${error}\n`,
      );
    }
  }

  private rotateLogFile(filePath: string): void {
    try {
      const oldestFile = `${filePath}.${this.maxBackups}`;
      if (fs.existsSync(oldestFile)) {
        fs.unlinkSync(oldestFile);
      }

      for (let i = this.maxBackups - 1; i >= 1; i--) {
        const oldFile = `${filePath}.${i}`;
        const newFile = `${filePath}.${i + 1}`;
        if (fs.existsSync(oldFile)) {
          fs.renameSync(oldFile, newFile);
        }
      }

      if (fs.existsSync(filePath)) {
        const backupFile = `${filePath}.1`;
        if (fs.existsSync(backupFile)) {
          fs.unlinkSync(backupFile);
        }
        fs.renameSync(filePath, backupFile);
      }
    } catch (error) {
      process.stderr.write(`Failed to rotate log file ${filePath}: ${error}\n`);
    }
  }
}
