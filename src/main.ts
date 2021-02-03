import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.register(fastifyCookie, {
    secret: 'my-secret', // TODO: generate it randomly(uuid) or set in environment file
  });
  await app.register(fastifyCsrf);
  await app.listen(3000);
}

bootstrap();
