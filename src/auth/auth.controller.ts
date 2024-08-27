import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

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
  async googleAuthRedirect(@Req() req) {
    // const state = decodeURIComponent(req.query.state || "");

    // if (!state) {
    //   throw new Error('Missing state parameter');
    // }

    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout(); // Assuming you're using session-based auth
    return { message: 'Logged out successfully' };
  }
}
