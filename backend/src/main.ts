import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS
    const corsOrigin = configService.get<string>('cors.origin') || 'http://localhost:5173';
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📊 Health check available at: http://localhost:${port}/health`);
  } catch (error) {
    logger.error('❌ Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
