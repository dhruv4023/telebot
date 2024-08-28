import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { MainAdminGuard } from './main-admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add')
  @UseGuards(MainAdminGuard)
  async addAdmin(
    @Body('name') name: string,
    @Body('email') email: string,
    // @Body('mainAdmin') mainAdmin: boolean,
  ): Promise<Object> {
    try {
      if (await this.adminService.getAdminByEmail(email)) {
        throw new Error('User Already exit with this email: ' + email);
      }
      await this.adminService.addAdmin(name, email);
      return { message: 'Admin added' };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete('remove/:id')
  @UseGuards(MainAdminGuard)
  async removeAdmin(@Param('id') id: string): Promise<Object> {
    const msg = this.adminService.removeAdmin(id);
    return { message: msg };
  }
}
