import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/Cart.entity';
import { IsNull, Repository } from 'typeorm';
import { boxesCharge } from '../utils/constants';
import axios from 'axios';
import * as process from 'process';
import { InitializeTransaction, PaymentStatus } from '../dto/checkout.dto';
import { Checkout } from '../entities/Checkout.entity';
import {
  IInitalizeTransactionData,
  IInitializeTransactionResponse,
  ordersPagination,
} from '../interfaces/general';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
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

  async initializeTransaction(
    id: string,
    data: InitializeTransaction,
  ): Promise<IInitializeTransactionResponse<IInitalizeTransactionData>> {
    const checkout = new Checkout();
    const user = await this.userService.findOne(id);
    const cartsToUpdate = await this.cartRepository.findBy({
      user,
      checkout: IsNull(),
    });
    cartsToUpdate.forEach(cart => {
      cart.checkout = checkout;
    });
    checkout.user = user;
    checkout.orderStatus = 'review';
    checkout.paymentStatus = 'unpaid';
    checkout.extraInfo = data.extraInfo;
    checkout.location = data.location;
    checkout.name = data.name;
    checkout.amount = data.amount;

    try {
      const response = await axios.post(
        `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          ...data,
          reference: `${id}=${checkout.id}`,
          email: user.email,
          callback_url: `${process.env.FRONTEND_URL}/confirm-payment/${id}/${checkout.id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );
      await this.checkoutRepository.save(checkout);
      await this.cartRepository.save(cartsToUpdate);
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response?.data?.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmPayment(userId: string, checkoutId: string): Promise<Checkout> {
    try {
      await axios.get(
        `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${userId}=${checkoutId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );
      const checkout = await this.checkoutRepository.findOneBy({
        id: checkoutId,
      });
      checkout.paymentStatus = 'paid';
      return this.checkoutRepository.save(checkout);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response?.data?.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrders(id: string): Promise<Checkout[]> {
    const user = await this.userService.findOne(id);
    return this.checkoutRepository.findBy({ user });
  }

  async getOrder(id: string): Promise<Checkout> {
    const checkout = await this.checkoutRepository.findOneBy({ id });
    await checkout.carts;

    return checkout;
  }

  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    orderStatus: string = '',
    paymentStatus: string = '',
  ): Promise<ordersPagination> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.checkoutRepository.createQueryBuilder('checkout');

    queryBuilder.leftJoinAndSelect('checkout.carts', 'carts');

    queryBuilder.leftJoinAndSelect('carts.product', 'product');

    if (searchTerm) {
      queryBuilder.where('LOWER(order.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm.toLowerCase()}%`,
      });
    }

    if (orderStatus) {
      queryBuilder.andWhere(
        'LOWER(order.orderStatus) LIKE LOWER(:orderStatus)',
        {
          orderStatus: `%${orderStatus.toLowerCase()}%`,
        },
      );
    }

    if (paymentStatus) {
      queryBuilder.andWhere(
        'LOWER(order.paymentStatus) LIKE LOWER(:paymentStatus)',
        {
          paymentStatus: `%${paymentStatus.toLowerCase()}%`,
        },
      );
    }

    const [orders, totalItems] = await queryBuilder
      .skip(skip)
      .take(10)
      .getManyAndCount();

    return {
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      orders,
    };
  }

  async orderStatus(id: string, data: PaymentStatus): Promise<Checkout> {
    const checkout = await this.checkoutRepository.findOneBy({ id });
    checkout.orderStatus = data.status;

    await this.checkoutRepository.save(checkout);

    return checkout;
  }
}
