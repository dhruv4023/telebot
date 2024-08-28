import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './auth/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongoDBModule } from './mongodb/mongodb.module';
import { PassportModule } from '@nestjs/passport';
import { WeatherService } from './weather/weather.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiSecretModule } from './auth/secrets/secret.module';
import { ApiSecretService } from './auth/secrets/secret.service';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
    ApiSecretModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    MongoDBModule,
    HttpModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService, WeatherService],
})
export class AppModule {}
