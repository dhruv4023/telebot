// auth.types.ts (or similar)
import { JwtPayload as OriginalJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends OriginalJwtPayload {
  mainAdmin?: boolean; // Optional if not always present
}
