import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:9000', process.env.CLIENT_URL],
  });
  await app.listen(9000);
}
bootstrap();
