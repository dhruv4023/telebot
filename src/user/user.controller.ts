import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin/admin.guard';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('user')
@UseGuards(AdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Delete user by username
  @Delete('delete/:username')
  async deleteUser(@Param('username') username: string): Promise<Object> {
    const msg = this.userService.deleteUserByUserName(username);
    return { message: msg };
  }

  // Block user by chatId
  @Post('block')
  async blockUser(@Body('chatId') chatId: number): Promise<Object> {
    const msg = this.userService.blockUser(chatId);
    return { message: msg };
  }

  // Unblock user by chatId
  @Post('unblock')
  async unblockUser(@Body('chatId') chatId: number): Promise<Object> {
    const msg = this.userService.unblockUser(chatId);
    return { message: msg };
  }
}
