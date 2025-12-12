import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import 'dotenv/config';
import { LoggingService } from './common/logging/logging.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const loggingService = app.get(LoggingService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));
  app.useGlobalFilters(new HttpExceptionFilter(loggingService));

  try {
    const apiYamlPath = path.join(process.cwd(), 'doc', 'api.yaml');
    if (fs.existsSync(apiYamlPath)) {
      const apiYamlContent = fs.readFileSync(apiYamlPath, 'utf8');
      const document = yaml.load(apiYamlContent) as OpenAPIObject;
      if (document) {
        SwaggerModule.setup('doc', app, document);
      }
    }
  } catch (error) {
    loggingService.error(
      'Failed to setup Swagger',
      error instanceof Error ? error.stack : String(error),
      'Bootstrap',
    );
  }

  process.on('uncaughtException', (error: Error) => {
    loggingService.error('Uncaught Exception', error.stack, 'Process');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    loggingService.error(
      `Unhandled Rejection: ${reason}`,
      reason instanceof Error ? reason.stack : String(reason),
      'Process',
    );
    process.exit(1);
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
