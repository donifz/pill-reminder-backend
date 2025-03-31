import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Enable CORS with specific origin
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:8082',
        'http://localhost:19006',
        process.env.FRONTEND_URL || 'https://medicine-reminder-frontend.onrender.com',
      ],
      credentials: true,
    });

    // Enable validation
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
  return app;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3001;
    app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

// For production (Render)
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
  return app(req, res);
}
