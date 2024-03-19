import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.entity';

@Entity({ name: 'verifications' })
export class Verification {
  constructor() {
    // Generate a UUID for the new user instance
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    enum: ['email', 'phone'],
  })
  type: string;

  @Column()
  token: string;

  @Column({ default: new Date() })
  createdAt: Date;
}
