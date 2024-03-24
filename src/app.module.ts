import { Module, ParseBoolPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
