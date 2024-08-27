import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/dailytask")
  automaticTasks(): void {
    this.telegramService.sendDailyWeatherUpdate();
  }
}
