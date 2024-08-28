import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiSecretService } from './secret.service';
import { IApiSecret } from './schema/secrets.schema';
import { AdminGuard } from '../admin/admin.guard';
import { MainAdminGuard } from '../admin/main-admin.guard';

@UseGuards(AdminGuard)
@Controller('api-secrets')
export class ApiSecretController {
  constructor(private readonly apiSecretService: ApiSecretService) {}

  @Post()
  @UseGuards(MainAdminGuard)
  async createApiSecret(
    @Body() body: { key: string; secret: string },
  ): Promise<IApiSecret> {
    const { key, secret } = body;
    return await this.apiSecretService.createApiSecret(key, secret);
  }

  @Get('all')
  async getApiSecret(): Promise<IApiSecret[]> {
    return await this.apiSecretService.getAllApiSecret();
  }

  @Put(':key')
  async updateApiSecret(
    @Param('key') key: string,
    @Body() body: { secret: string },
  ): Promise<IApiSecret> {
    const { secret } = body;
    return await this.apiSecretService.updateApiSecret(key, secret);
  }

  @Delete(':key')
  async deleteApiSecret(@Param('key') key: string): Promise<void> {
    await this.apiSecretService.deleteApiSecret(key);
  }
}
