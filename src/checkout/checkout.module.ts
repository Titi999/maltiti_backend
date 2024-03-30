import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { UsersModule } from '../users/users.module';
import { CartModule } from '../cart/cart.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule, CartModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, UsersService],
})
export class CheckoutModule {}
