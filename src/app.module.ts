import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongoDBModule } from './mongodb/mongodb.module';
import { PassportModule } from '@nestjs/passport';
import { WeatherService } from './weather/weather.service';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    MongoDBModule,
    HttpModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService, WeatherService],
})
export class AppModule {}
