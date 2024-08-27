import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}
  @Get('settings')
  getSettings() {
    // Return current settings
  }

  @Post('settings')
  updateSettings(@Body() settingsDto: any) {
    // Update settings like API keys
  }

  @Get('users')
  getUsers() {
    return this.authService.getAllSubscribedUsers();
  }

  @Post('users/:id/block')
  blockUser(@Param('id') id: string) {
    // Block a user
  }

  @Post('users/:id/delete')
  deleteUser(@Param('id') id: string) {
    // Delete a user
  }
}
