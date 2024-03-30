import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IResponse, IUserToken } from '../interfaces/general';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { SignInDto } from '../dto/signIn.dto';
import { AuthenticationService } from './authentication.service';

import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { Request } from 'express';
import { User } from '../entities/User.entity';
import { VerifyPhoneDto } from '../dto/UserInfo.dto';
import { Roles } from './guards/roles/roles.decorator';
import { RolesGuard } from './guards/roles/roles.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private usersService: UsersService,
    private authService: AuthenticationService,
  ) {}
  @UsePipes(new ValidationPipe())
  @Post('sign-up')
  async register(@Body() userInfo: RegisterUserDto): Promise<IResponse<User>> {
    const user = await this.usersService.create(userInfo);
    delete user.password;
    return {
      message: 'User registration successful',
      data: user,
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('verify-phone/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['user'])
  async verifyPhone(
    @Param('id') id: string,
    @Body() phoneInfo: VerifyPhoneDto,
  ): Promise<IResponse<User>> {
    const user = await this.usersService.phoneVerification(id, phoneInfo);
    delete user.password;
    return {
      message: 'Phone verification successful',
      data: user,
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('customer-signup')
  async customerSignup(
    @Body() userInfo: RegisterUserDto,
  ): Promise<IResponse<User>> {
    const user = await this.usersService.create(userInfo);
    delete user.password;
    return {
      message: `Email has been sent to ${user.email}. Please verify your email`,
      data: user,
    };
  }

  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<IResponse<IUserToken>> {
    return this.authService.signIn(signInDto);
  }

  @Get('send-email')
  async sendEmail(): Promise<void> {
    await this.authService.sendWelcomeMail();
  }

  @Get('verify/:id/:token')
  async emailVerification(
    @Param('id') id: string,
    @Param('token') token: string,
  ): Promise<void> {
    await this.authService.emailVerification(id, token);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invalidate-token')
  async invalidateToken(@Req() request: Request): Promise<{ message: string }> {
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    await this.authService.invalidateToken(token);
    return { message: 'Token invalidated successfully' };
  }
}
