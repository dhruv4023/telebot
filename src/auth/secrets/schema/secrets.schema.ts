import { Schema, Document } from 'mongoose';

export interface IApiSecret extends Document {
  key: string;
  secret: string;
}

const ApiSecretSchema = new Schema<IApiSecret>({
  key: { type: String, required: true, unique: true },
  secret: { type: String, required: true },
});

export default ApiSecretSchema;
