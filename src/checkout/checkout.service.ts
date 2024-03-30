import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/Cart.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { boxesCharge } from '../utils/constants';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  async getTransportation(
    id: string,
    location: 'local' | 'other',
  ): Promise<number> {
    const user = await this.userService.findOne(id);
    const cart = await this.cartRepository.findBy({ user });

    let boxes = 0;

    cart.forEach(cartItem => {
      boxes += cartItem.quantity / parseInt(cartItem.product.quantityInBox);
    });

    if (boxes < 1) {
      boxes = 1;
    }

    return (
      boxes * (location === 'local' ? boxesCharge.Tamale : boxesCharge.Other)
    );
  }
}
