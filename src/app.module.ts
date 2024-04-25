import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CooperativeModule } from './cooperative/cooperative.module';
import { Cooperative } from './entities/Cooperative.entity';
import { CooperativeMember } from './entities/CooperativeMember.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/Product.entity';
import { Verification } from './entities/Verification.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './entities/Cart.entity';
import { CheckoutModule } from './checkout/checkout.module';
import { Checkout } from './entities/Checkout.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Cooperative,
        CooperativeMember,
        Product,
        Verification,
        Cart,
        Checkout,
      ],
      synchronize: true,
      autoLoadEntities: false,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        auth: {
          user: process.env.AWS_SMTP_USERNAME,
          pass: process.env.AWS_SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <abubakaribilal99@gmail.com',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ConfigModule.forRoot(),
    AuthenticationModule,
    UsersModule,
    CooperativeModule,
    ProductsModule,
    CartModule,
    CheckoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule],
})
export class AppModule {}
