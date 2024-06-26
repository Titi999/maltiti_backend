import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserInfoDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  userType: string;
}

export class VerifyPhoneDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  code: string;
}
