import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  try {
    const apiYamlPath = path.join(process.cwd(), 'doc', 'api.yaml');
    if (fs.existsSync(apiYamlPath)) {
      const apiYamlContent = fs.readFileSync(apiYamlPath, 'utf8');
      const document = yaml.load(apiYamlContent) as OpenAPIObject;
      if (document) {
        SwaggerModule.setup('doc', app, document);
      }
    }
  } catch (error) {}

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
