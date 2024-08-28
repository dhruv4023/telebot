import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
const MongoStore = require('connect-mongo');
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine('ejs');
  app.setBaseViewsDir(path.join(__dirname, '..', 'views')); // Directory for views

  // Serve static files from the public directory
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with your actual secret
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, // Replace with your MongoDB URL
      }),
      cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
