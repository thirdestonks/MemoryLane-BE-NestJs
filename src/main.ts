// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('APP_PORT') || 3001;
  const clientUrl = config.get<string>('APP_CLIENT_URL');

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  // 👇 Log all registered routes
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: string[] = [];

  router.stack.forEach((layer) => {
    if (layer.route) {
      const routePath = layer.route.path;
      const method = Object.keys(layer.route.methods)[0].toUpperCase();
      availableRoutes.push(`${method} ${routePath}`);
    }
  });

  console.log('\n🔗 Available Routes:');
  console.table(availableRoutes);

  await app.listen(port);
}
bootstrap();
