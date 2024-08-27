import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getAbout(): string {
    return 'The Bot server for telegram weather bot!';
  }
}
