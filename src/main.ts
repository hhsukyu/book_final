import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const config = new DocumentBuilder()
    .setTitle('Sparta_final')
    .setDescription('Final API description')
    .setVersion('1.0')
    .addTag('Final')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'accessToken',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'refreshToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  // 환경 변수 설정
  const configService = app.get(ConfigService);
  const port: number = configService.get('SERVER_PORT');

  // app.useStaticAssets(join(__dirname, "..", "assets")); // 정적 프론트 파일 (이번 최종 프로젝트에서는 사용할지 고민)

  console.log(port);

  await app.listen(port);
}
bootstrap();
