import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.entity';
import { Cart } from './Cart.entity';
import { orderStatuses } from '../interfaces/checkout.interface';

@Entity({ name: 'Checkouts' })
export class Checkout {
  constructor() {
    // Generate a UUID for the new user instance
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Cart, cart => cart.checkout, { lazy: true })
  @JoinColumn()
  carts: Cart[];

  @Column({
    enum: orderStatuses,
  })
  orderStatus: string;

  @Column()
  amount: string;

  @Column({ enum: ['paid', 'unpaid', 'refunded'] })
  paymentStatus: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @Column()
  location: string;

  @Column()
  name: string;

  @Column()
  extraInfo: string;
}
