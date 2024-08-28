// main-admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateToken } from '../auth.utils'; // Adjust path as necessary

@Injectable()
export class MainAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decoded = validateToken(token);
    
    if (!decoded.mainAdmin) {
      throw new UnauthorizedException('Not authorized as main admin');
    }

    request.user = decoded;
    // console.log(request.user)
    return true;
  }
}
