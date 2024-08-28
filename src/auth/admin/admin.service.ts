import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
  ) {}

  // Add a new admin
  async addAdmin(name: string, email: string): Promise<Admin> {
    try {
      const newAdmin = new this.adminModel({ name, email });
      return newAdmin.save();
    } catch (error) {
      throw error;
    }
  }

  // Remove an admin by ID, ensuring that mainAdmin cannot be removed
  async removeAdmin(id: string): Promise<String> {
    const admin = await this.adminModel.findOne({ _id: id }).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.mainAdmin) {
      throw new ForbiddenException('Main admin cannot be removed');
    }
    const result = await this.adminModel
      .deleteOne({ email: admin.email })
      .exec();
    if (result.deletedCount === 0) {
      return 'admin Not deleted with email: ' + admin.email;
    }
    return ' Admin deleted successfully with email: ' + admin.email;
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ email }).exec();
    return admin;
  }
  async getAdmins(): Promise<Admin[]> {
    return (await this.adminModel.find().exec()) || [];
  }
}
