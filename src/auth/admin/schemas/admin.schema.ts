import { Schema, Document } from 'mongoose';

// Define the AdminUser interface extending Mongoose's Document
export interface Admin extends Document {
  readonly name: string;
  readonly email: string;
  readonly mainAdmin: boolean;
}

// Define the AdminUser schema
export const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mainAdmin: { type: Boolean, default: false },
});
