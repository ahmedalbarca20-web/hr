import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './modules/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running locally on http://localhost:${port}`);
  }

  await app.init();
  return app.getHttpAdapter().getInstance();
}

// لكي يعمل على Vercel
export const handler = async (req: any, res: any) => {
  const instance = await bootstrap();
  instance(req, res);
};

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

