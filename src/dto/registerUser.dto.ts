import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { always: true },
  )
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  userType: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
