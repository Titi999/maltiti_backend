import { IsNotEmpty } from 'class-validator';

export class AddCartDto {
  @IsNotEmpty()
  id: string;
}

export class AddQuantityDto {
  @IsNotEmpty()
  quantity: number;
}
