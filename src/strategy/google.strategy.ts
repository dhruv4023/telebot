import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { sign } from 'jsonwebtoken';
import { AdminService } from 'src/auth/admin/admin.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly adminService: AdminService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_BASE_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true, // Enables passing the request to the validate function
    });
  }

  authenticate(req, options) {
    options.state = 'your state value here';
    super.authenticate(req, options);
  }

  async validate(
    req: any, // This is the request object
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    try {
      const admin = await this.adminService.getAdminByEmail(emails[0].value);
      if (!admin) {
        throw new NotFoundException(
          'Admin not found. Please contact the main admin.',
        );
      }
      const user = {
        email: emails[0].value,
        name: name.givenName + ' ' + name.familyName,
        accessToken,
        token: sign(
          { email: emails[0].value, mainAdmin: admin.mainAdmin },
          process.env.JWT_SECRET,
        ),
      };

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
