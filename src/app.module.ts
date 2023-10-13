import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/User.entity";
import { ConfigModule } from '@nestjs/config';
import * as process from "process";
import {Connection} from "typeorm";
import { UsersModule } from './users/users.module';
import {MailerModule} from "@nestjs-modules/mailer";
import { join } from 'path';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { CooperativeModule } from './cooperative/cooperative.module';
import {Cooperative} from "./entities/Cooperative.entity";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [User, Cooperative],
          synchronize: true
      }),
      MailerModule.forRoot({
          transport: {
              host: 'smtp.gmail.com',
              auth: {
                  user: process.env.USER_EMAIL,
                  pass: process.env.USER_PASSWORD
              }
          },
          defaults: {
              from: '"No Reply" <noreply@maltitiaenterprise.com'
          },
          template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                  strict: true
              }
          }
      }),
      ConfigModule.forRoot(),
      AuthenticationModule,
      UsersModule,
      CooperativeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    constructor(private readonly connection: Connection) {
    }
}
