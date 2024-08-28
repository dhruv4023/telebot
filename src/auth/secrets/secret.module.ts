import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ApiSecretSchema from './schema/secrets.schema';
import { ApiSecretService } from './secret.service';
import { ApiSecretController } from './secret.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ApiSecret', schema: ApiSecretSchema }]),
  ],
  providers: [ApiSecretService],
  controllers: [ApiSecretController],
  exports: [ApiSecretService],
})
export class ApiSecretModule {}
