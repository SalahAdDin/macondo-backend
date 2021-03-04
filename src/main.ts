import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  if (process.env.NODE_ENV === 'development') app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.register(fastifyCookie, {
    secret: 'my-secret', // TODO: generate it randomly(uuid) or set in environment file
  });
  await app.register(fastifyCsrf);
  const port = process.env.SERVER_PORT;
  await app.listen(parseInt(port, 10));
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
