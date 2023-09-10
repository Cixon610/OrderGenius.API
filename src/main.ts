import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', process.env.CLIENT_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  //#region Swagger
  const config = new DocumentBuilder()
    .setTitle('MenuGeniuse API')
    .setDescription('MenuGeniuse API document')
    .setVersion('1.0')
    // .addTag('nestjs')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //#endregion

  await app.listen(process.env.PORT || 9000);
}
bootstrap();
