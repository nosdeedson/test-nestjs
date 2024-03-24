import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {
  }

  getHello(): string {
    return 'Hello World!';
  }

  getVariable(): any {
    // console.log(configuration)
    // return configuration()
    console.log(process.env.HOST)
    console.log(process.env.USER_DATA_BASE)
    console.log(process.env.PASSWORD_DATA_BASE)
    console.log(process.env.DATA_BASE)
    return this.configService.get<string>('TEST_VARIABLE');
  }
}
