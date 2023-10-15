import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const port = process.env.APP_PORT
  await app.listen(port);
}
bootstrap();
