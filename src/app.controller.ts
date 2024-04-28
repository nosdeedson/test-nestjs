import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle, Throttle, minutes } from '@nestjs/throttler';
import { skip } from 'node:test';

@SkipThrottle({skip: true})
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle({skip: false})
  @Throttle({sistema:{ttl: minutes(1), limit: 2},})
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @SkipThrottle({skip: true})
  @Get("/variable")
  getVariable(): any {
    return this.appService.getVariable();
  }


  @Throttle({sistema:{ttl: minutes(1), limit: 2},})
  @Get("/test/:doc/:key")
  getTest(@Param("test") doc: string, @Param('key') key: string): any {
    return this.appService.getTest(doc, key);
  }
}
