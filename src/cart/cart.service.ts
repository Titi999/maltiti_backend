import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Cart } from '../entities/Cart.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AddCartDto, AddQuantityDto } from '../dto/addCart.dto';
import { User } from '../entities/User.entity';
import { Product } from '../entities/Product.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
  ) {}
  async getCustomerCart(id: string): Promise<[Cart[], number]> {
    const user = await this.userService.findOne(id);
    return await this.cartRepository.findAndCountBy({
      user: user,
    });
  }

  async removeFromCart(id: string): Promise<DeleteResult> {
    return await this.cartRepository.delete(id);
  }

  async removeAllFromCart(id: string): Promise<DeleteResult> {
    const user = await this.userService.findOne(id);
    return await this.cartRepository.delete({ user });
  }

  async addToCart(id: string, addCart: AddCartDto): Promise<Cart> {
    const { user, product, existingCart } = await this.findCart(id, addCart.id);

    if (existingCart) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Product already exists in cart',
        },
        HttpStatus.CONFLICT,
      );
    }

    const cart = new Cart();
    cart.user = user;
    cart.product = product;
    cart.quantity = 1;

    return this.cartRepository.save(cart);
  }

  async addQuantity(id: string, addQuantity: AddQuantityDto): Promise<Cart> {
    const { existingCart } = await this.findCart(id, addQuantity.id);
    existingCart.quantity = addQuantity.quantity;
    return this.cartRepository.save(existingCart);
  }

  async findCart(
    id: string,
    productId: string,
  ): Promise<{ user: User; product: Product; existingCart: Cart }> {
    const user = await this.userService.findOne(id);
    const product = await this.productsService.findOne(productId);

    const existingCart = await this.cartRepository.findOneBy({
      product,
      user,
    });

    return { user, product, existingCart };
  }
}
