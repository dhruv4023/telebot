// auth.utils.ts (or similar)
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './auth.types'; // Adjust path as necessary

export function validateToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // Replace with your JWT secret
    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}
