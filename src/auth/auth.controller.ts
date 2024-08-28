import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
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
  async googleAuthRedirect(@Req() req,@Res() res: Response) {
    if (req.session) {
      req.session.user = req.user;
      res.redirect('/admin-panel');
    } else {
      // Handle the case where session is not initialized
      res.status(500).send('Session is not initialized');
    }
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout(); // Assuming you're using session-based auth
    return { message: 'Logged out successfully' };
  }
}
