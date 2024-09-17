import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { Request, Response } from 'express';
import { AdminService } from './auth/admin/admin.service';
import { UserService } from './user/user.service';
import { ApiSecretService } from './auth/secrets/secret.service';

@Controller()
export class AppController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly apiSecretService: ApiSecretService,
    private readonly appService: AppService,
    private readonly telegramService: TelegramService,
  ) {}
  @Get('/admin-panel')
  async getHome(@Req() req: Request, @Res() res: Response) {
    const auth = req?.session?.user;
    const message = req?.session?.message || '';
    const apiBaseUrl = process.env.APP_BASE_URL;
    if (auth) {
      const isMainAdmin = (await this.adminService.getAdminByEmail(auth.email))
        .mainAdmin;
      const admins = await this.adminService.getAdmins();
      const users = await this.userService.getAllSubscribedUsers();
      const apiSecrets = await this.apiSecretService.getAllApiSecret();
      // console.log(apiSecrets)
      res.render('admin-panel', {
        auth,
        message,
        apiBaseUrl,
        admins,
        users,
        apiSecrets,
        isMainAdmin,
      });
    } else {
      res.render('login', {
        apiBaseUrl: apiBaseUrl,
        message: 'Please log in to access the admin panel.',
      });
    }
  }
  @Get('/about')
  getAbout(): string {
    return this.appService.getAbout();
  }

  @Get('/dailytask')
  automaticTasks(): void {
    this.telegramService.sendDailyWeatherUpdate();
  }
}
