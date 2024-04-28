import { Module, ParseBoolPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { Throttle, ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrollerGuard } from './throller/custom-throller-message/custom-throller-guard';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
      name: 'sistema',
      ttl: 60000, // minutes
      limit: 250,
      },
      {
        name: 'doc-chave',
        ttl: minutes(1),
        limit: 3
      },
      {
        name: 'doc-qtd',
        ttl: minutes(1),
        limit: 20
      }
  ]),
    ConfigModule.forRoot({
     // load: [configuration],
     envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
      // envFilePath: ['.development.env']
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      username: process.env.USER_DATA_BASE,
      password: process.env.PASSWORD_DATA_BASE,
      database: process.env.DATA_BASE,
      synchronize: true,
      port: 5432,
      entities: [User]
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrollerGuard
    }
  ],
})
export class AppModule {}
