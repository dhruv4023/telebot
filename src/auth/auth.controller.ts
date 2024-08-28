import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import * as session from 'express-session';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This route initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    if (req.session) {
      req.session.user = req.user;
      res.redirect('/admin-panel');
    } else {
      // Handle the case where session is not initialized
      res.status(500).send('Session is not initialized');
    }
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return { message: 'Error during logout' };
      }
      return { message: 'Logged out successfully' };
    });
    res.redirect('/home');
  }
}
