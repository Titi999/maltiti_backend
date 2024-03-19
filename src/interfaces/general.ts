import { Cooperative } from '../entities/Cooperative.entity';
import { CooperativeMember } from '../entities/CooperativeMember.entity';
import { User } from '../entities/User.entity';

export interface IResponse<T> {
  message: string;
  data: T;
}

export interface productsPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  products: product[];
}

export interface cooperativesPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  cooperatives: Cooperative[];
}

export interface cooperativeMembersPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  members: CooperativeMember[];
}

export interface cooperativeMemberPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  members: CooperativeMember;
}

export interface product {
  image: string;
  quantityInBox: string;
  rating: string;
  weight: string;
  description: string;
  stockQuantity: string;
  inBoxPrice: string;
  retail: string;
  createdAt: Date;
  wholesale: string;
  size: string;
  reviews: string;
  name: string;
  ingredients: string[];
  id: string;
  category: string;
  favorite: boolean;
  status: string;
  updatedAt: Date;
}

export interface IBestProducts {
  totalItems: number;
  data: product[];
}

export interface IUserToken {
  accessToken: string;
  refreshToken: string;
  user: User;
}
