import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { IsEmail } from 'class-validator';

@Entity({ name: 'users' })
export class User {
  constructor() {
    // Generate a UUID for the new user instance
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsEmail()
  @Unique(['email'])
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ enum: ['user', 'admin'] })
  userType: string;

  @Column({ nullable: true })
  @Unique(['phoneNumber'])
  phoneNumber: string;

  @Column({ nullable: true })
  permissions: string;

  @Column({ nullable: true })
  rememberToken: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
