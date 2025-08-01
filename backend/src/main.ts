import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour permettre les requêtes depuis ton frontend
  app.enableCors({
    origin: [
      'http://localhost:3000', // Pour le développement local
      'http://localhost:5500', // Live Server (VS Code)
      'http://127.0.0.1:5500', // Live Server alternative
      'http://localhost:8080', // Autre serveur de dev courant
      'http://127.0.0.1:8080', // Alternative
      'https://lesbarjosdubarajo.com', // Remplace par ton URL GitHub Pages
      'https://ton-domaine.web.app', // Pour Firebase Hosting plus tard
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Validation automatique des DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans les DTOs
    forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés supplémentaires
    transform: true, // Transforme automatiquement les types
  }));

  // Préfixe global pour l'API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
  console.log(`📚 API disponible sur http://localhost:${port}/api`);
}

bootstrap();