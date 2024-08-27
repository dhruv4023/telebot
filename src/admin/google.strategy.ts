import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      state: true,
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
    console.log('Received state:', req.query.state);
    // Defensive check for state parameter
    const state = req.query.state ? decodeURIComponent(req.query.state) : '';
    const [tgPart, usernamePart] = state.split('|');

    // Default values in case state is not in the expected format
    const chatId = tgPart.replace('tg_', '');
    const username = usernamePart.replace('username_', '');

    console.log(chatId, username);
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
      chatId, // Adding chatId to user details
      username, // Adding username to user details
    };

    done(null, user);
  }
}
