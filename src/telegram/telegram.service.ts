import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { WeatherService } from 'src/weather/weather.service';

const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: any;

  constructor(
    private readonly authService: AuthService,
    private readonly weatherService: WeatherService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
    this.bot.on('message', this.handleMessage.bind(this));
  }

  async handleMessage(msg): Promise<void> {
    const chatId = msg.chat.id;
    const chatUsername = msg.chat.username;
   
    if (msg.text === '/start') {
      await this.bot.sendMessage(
        chatId,
        'Use command /subscribe to subscribe to daily weather updates!\n' +
          'Use command /unsubscribe to unsubscribe from daily weather updates!',
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
        if (!user.blocked) {
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

  // @Cron('0 * * * *')
  @Cron('*/1 * * * *') // Runs every minute
  async handleCron(): Promise<void> {
    console.log('Scheduler triggered at:', new Date().toISOString());
    await this.sendDailyWeatherUpdate();
    console.log('sent....');
  }

  async getSubscribedUsers(): Promise<any[]> {
    return this.authService.getAllSubscribedUsers();
  }
}
