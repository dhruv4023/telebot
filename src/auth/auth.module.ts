import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../strategy/google.strategy';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),AdminModule],
  providers: [UserService, GoogleStrategy],
  controllers: [AuthController],
  exports: [UserService],
})
export class AuthModule {}
