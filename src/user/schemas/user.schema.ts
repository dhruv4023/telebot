import { Schema, Document } from 'mongoose';

// Define the User interface extending Mongoose's Document
export interface User extends Document {
  readonly chatId: number;
  readonly username: string;
  readonly city: string;
  readonly isBlocked?: boolean;
}

// Define the User schema
export const UserSchema = new Schema({
  chatId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  city: { type: String, default: 'Ahmedabad' },
  isBlocked: { type: Boolean, default: false },
});
