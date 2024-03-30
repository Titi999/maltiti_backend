import { v4 as uuid } from 'uuid';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'Products' })
export class Product {
  constructor() {
    // Generate a UUID for the new user instance
    this.id = uuid();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ingredients: string;

  @Column()
  weight: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  size: string;

  @Column()
  image: string;

  @Column()
  wholesale: string;

  @Column()
  retail: string;

  @Column()
  stockQuantity: string;

  @Column()
  inBoxPrice: string;

  @Column()
  quantityInBox: string;

  @Column({
    default: false,
  })
  favorite: boolean;

  @Column()
  rating: string;

  @Column()
  reviews: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
