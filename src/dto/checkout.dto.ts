import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';
import { status } from '../interfaces/checkout.interface';

export class InitializeTransaction {
  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  email: string;

  @Optional()
  extraInfo: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  location: string;
}

export class PaymentStatus {
  status: status;
}
