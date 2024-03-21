import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/Cart.entity';
import { UsersModule } from '../users/users.module';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UsersModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService, UsersService, ProductsService],
})
export class CartModule {}
