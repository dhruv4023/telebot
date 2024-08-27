import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  // Method to create a new user
  async createUser(chatId: number, username: string): Promise<User> {
    const newUser = new this.userModel({
      chatId,
      username,
    });

    return newUser.save();
  }

  // Method to delete a user by username
  async deleteUserByUserName(username: string): Promise<string> {
    const result = await this.userModel.deleteOne({ username }).exec();
    console.log(result.deletedCount);
    if (result.deletedCount === 0) {
      return 'you have already unsubscribed !!!';
    }
    return 'User successfully unsubscribed';
  }

  // Method to find a user
  async findUserByUserName(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // Method to validate or create a user during Google OAuth
  async validateOrCreateUser(
    chatId: number,
    username: string,
  ): Promise<string> {
    const user = await this.findUserByUserName(username);
    if (user) {
      return 'you have already subscibed';
    }
    // Create a new user with details from Google
    this.createUser(chatId, username);
    return 'you have successfully subscibed to daily weather updates!';
  }

  // Method to get all subscribed users
  async getAllSubscribedUsers(): Promise<User[]> {
    return this.userModel.find({ admin: false }).exec();
  }

  // Method to get all blocked users
  async getAllBlockedUsers(): Promise<User[]> {
    return this.userModel.find({ blocked: true }).exec();
  }

  // Method to get all non-blocked users
  async getAllNonBlockedUsers(): Promise<User[]> {
    return this.userModel.find({ blocked: false }).exec();
  }
  async getCityByChatId(chatId: number): Promise<string | null> {
    const user = await this.userModel.findOne({ chatId }).exec();
    if (user) {
      return user.city;
    }
    return 'Ahmedabad';
  }
  // Method to update the city for a user
  async updateUserCity(chatId: number, city: string): Promise<string> {
    const result = await this.userModel
      .updateOne({ chatId }, { $set: { city } })
      .exec();

    if (result.modifiedCount === 0) {
      return 'User not found or city is the same as before';
    }
    return 'City updated successfully';
  }
}
