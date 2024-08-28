import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { ApiSecretService } from '../auth/secrets/secret.service';
import { WeatherService } from '../weather/weather.service';

const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: any;

  constructor(
    private readonly authService: UserService,
    private readonly apiSecretService: ApiSecretService,
    private readonly weatherService: WeatherService,
  ) {}

  async onModuleInit() {
    try {
      const telegramToken =
        (await this.apiSecretService.getApiSecret('TELEGRAM_TOKEN')) ||
        process.env.TELEGRAM_TOKEN;

      this.bot = new TelegramBot(telegramToken, { polling: true });

      this.bot.on('message', this.handleMessage.bind(this));

      console.log('Telegram Bot initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Telegram Bot:', error);
    }
  }

  async handleMessage(msg): Promise<void> {
    const chatId = msg.chat.id;
    const chatUsername = msg.chat.username;

    if (msg.text === '/start') {
      await this.bot.sendMessage(
        chatId,
        '- Use command /subscribe to subscribe to daily weather updates!\n\n' +
          '- Use command /unsubscribe to unsubscribe from daily weather updates!\n\n' +
          "- User command /city to set city as you wish 'Usage: /city <city_name>' \n example: /city Ahmedabad",
      );
    } else if (msg.text === '/subscribe') {
      await this.subscribeUser(chatId, chatUsername);
    } else if (msg.text === '/unsubscribe') {
      await this.unsubscribeUser(chatId, chatUsername);
    } else if (msg.text.startsWith('/city')) {
      const commandParts = msg.text.split(' ');
      if (commandParts.length === 2) {
        const cityName = commandParts[1];
        this.bot.sendMessage(
          chatId,
          await this.authService.updateUserCity(chatId, cityName),
        );
      } else {
        await this.bot.sendMessage(chatId, 'Usage: /city <city_name>');
      }
    } else if (msg.text === '/now') {
      const weatherData = await this.weatherService.fetchWeatherData(
        await this.authService.getCityByChatId(chatId),
      );
      await this.bot.sendMessage(chatId, weatherData);
    } else {
      await this.bot.sendMessage(chatId, 'Hello');
    }
  }

  async unsubscribeUser(chatId: number, chatUsername: string): Promise<void> {
    try {
      const result = await this.authService.deleteUserByUserName(chatUsername);
      await this.bot.sendMessage(chatId, result);
    } catch (error) {
      await this.bot.sendMessage(chatId, `Error: ${error.message}`);
    }
  }

  async subscribeUser(chatId: number, chatUsername: string): Promise<void> {
    try {
      const result = await this.authService.validateOrCreateUser(
        chatId,
        chatUsername,
      );
      await this.bot.sendMessage(chatId, result);
    } catch (error) {
      await this.bot.sendMessage(chatId, `Error: ${error.message}`);
    }
  }

  async sendDailyWeatherUpdate(): Promise<void> {
    try {
      const users = await this.getSubscribedUsers();
      users.forEach(async (user) => {
        if (!user.isBlocked) {
          {
            const weatherData = await this.weatherService.fetchWeatherData(
              user.city,
            );
            await this.bot.sendMessage(
              user.chatId,
              `Today's weather: ${weatherData}`,
            );
          }
        }
      });
    } catch (error) {
      console.error('Error sending daily weather updates:', error);
    }
  }

  @Cron('* * * * *') // runs every minutes
  // @Cron('30 1 * * *') // Runs every day 7:30 am IST or 1:30 UTC
  async handleCron(): Promise<void> {
    console.log('Scheduler triggered at:', new Date().toISOString());
    await this.sendDailyWeatherUpdate();
    console.log('sent....');
  }

  async getSubscribedUsers(): Promise<any[]> {
    return this.authService.getAllSubscribedUsers();
  }
}
