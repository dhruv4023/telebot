import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IApiSecret } from './schema/secrets.schema';
import * as crypto from 'crypto';

@Injectable()
export class ApiSecretService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey = process.env.ENCRYPTION_KEY; // Store this key securely
  private readonly iv = crypto.randomBytes(16);

  constructor(
    @InjectModel('ApiSecret')
    private readonly apiSecretModel: Model<IApiSecret>,
  ) {}

  async createApiSecret(key: string, secret: string): Promise<IApiSecret> {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secretKey),
      this.iv,
    );
    let encrypted = cipher.update(secret);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encryptedSecret = `${this.iv.toString('hex')}:${encrypted.toString('hex')}`;

    const newApiSecret = new this.apiSecretModel({
      key,
      secret: encryptedSecret,
    });
    return await newApiSecret.save();
  }

  async getApiSecret(key: string): Promise<string> {
    const apiSecret = await this.apiSecretModel.findOne({ key }).exec();
    if (!apiSecret) {
      return null;
    }

    const [iv, encryptedSecret] = apiSecret.secret.split(':');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secretKey),
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(Buffer.from(encryptedSecret, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  async getAllApiSecret(): Promise<IApiSecret[]> {
    const apiSecrets = await this.apiSecretModel.find().exec();
    if (!apiSecrets) {
      throw new NotFoundException('API Secret not found');
    }
    return apiSecrets;
  }

  async updateApiSecret(key: string, secret: string): Promise<IApiSecret> {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secretKey),
      this.iv,
    );
    let encrypted = cipher.update(secret);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encryptedSecret = `${this.iv.toString('hex')}:${encrypted.toString('hex')}`;

    const updatedApiSecret = await this.apiSecretModel
      .findOneAndUpdate({ key }, { secret: encryptedSecret }, { new: true })
      .exec();
    if (!updatedApiSecret) {
      throw new NotFoundException('API Secret not found');
    }
    return updatedApiSecret;
  }

  async deleteApiSecret(key: string): Promise<Object> {
    const result = await this.apiSecretModel.deleteOne({ key }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('API Secret not found');
    }
    return { message: 'deleted succesfully' };
  }
}
