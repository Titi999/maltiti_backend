import {
  BadRequestException,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'process';
import { Verification } from '../entities/Verification.entity';
import { generateRandomToken } from '../utils/randomTokenGenerator';
import { VerifyPhoneDto } from '../dto/UserInfo.dto';
import axios from 'axios';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/forgotPassword.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private mailService: MailerService,
    private notificationService: NotificationService,
  ) {}

  async create(userInfo: RegisterUserDto): Promise<User> {
    if (userInfo.password !== userInfo.confirmPassword)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password and confirm password do not match',
        },
        HttpStatus.BAD_REQUEST,
      );

    if (await this.findByEmail(userInfo.email))
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with email already exists',
        },
        HttpStatus.CONFLICT,
      );

    const user = new User();
    await this.setUser(user, userInfo);
    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const verification = new Verification();
      verification.user = user;
      verification.type = 'email';
      const token = generateRandomToken();
      verification.token = token;
      const userResponse = await this.userRepository.save(user);
      await this.verificationRepository.save(verification);
      const idToken = `verify/${user.id}/${token}`;
      await this.sendVerificationEmail(user.email, user.name, idToken);
      return userResponse;
    }
  }

  async setUser(user: User, userInfo: RegisterUserDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userInfo.password, salt);
    user.name = userInfo.name;
    user.createdAt = new Date();
    user.phoneNumber = userInfo.phoneNumber;
    user.password = hashedPassword;
    user.userType = userInfo.userType;
    user.email = userInfo.email;
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    idToken: string,
  ): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      from: 'no-reply@maltitiaenterprise.com',
      subject: 'Verify your email',
      template: './welcome',
      context: {
        name: name,
        url: `${process.env.FRONTEND_URL}/${idToken}`,
        subject: 'Verify your email',
        body: `You have successfully created an account. Please verify your email by clicking the button below. Welcome onboard`,
        link: `${process.env.APP_URL}/${idToken}`,
        action: 'Verify',
      },
    });
  }

  async sendWelcomeMail(
    email: string,
    name: string,
    password: string,
  ): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      from: 'noreply@maltitiaenterprise.com',
      subject: 'Welcome on board',
      template: './welcome',
      context: {
        name: name,
        url: process.env.APP_URL,
        subject: 'Welcome on board',
        body: `Your admin has successfully created an account for you on Maltiti A. Enterprise Ltd Backoffice. Please login using the credentials; email: ${email} and password: ${password}`,
        link: 'Login',
        action: 'Login',
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email: email });
  }

  async findUserIncludingPasswordByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async verifyUserEmail(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    user.emailVerifiedAt = new Date();
    await this.userRepository.save(user);
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  async phoneVerification(
    id: string,
    phoneInfo: VerifyPhoneDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        phoneNumber: phoneInfo.phoneNumber,
      },
    });
    if (user) {
      throw new HttpException(
        {
          code: HttpStatus.CONFLICT,
          message: 'User with phone number already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    try {
      const response = await axios.post(
        `${process.env.ARKESEL_BASE_URL}/api/otp/verify`,
        {
          number: phoneInfo.phoneNumber,
          code: phoneInfo.code,
          'api-key': `${process.env.ARKESEL_SMS_API_KEY}`,
        },
        { headers: { 'api-key': `${process.env.ARKESEL_SMS_API_KEY}` } },
      );
      if (response.data.code === '1100') {
        const user = await this.userRepository.findOneBy({ id });
        user.phoneNumber = phoneInfo.phoneNumber;
        return this.userRepository.save(user);
      }
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: response.data.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response?.data?.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<User> {
    const user = await this.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User with email does not exists');
    }

    const verification = new Verification();
    const token = generateRandomToken();
    verification.token = token;
    verification.user = user;
    verification.type = 'email';
    await this.verificationRepository.save(verification);
    const resetLink = `reset-password/${token}`;
    await this.notificationService.sendEmail(
      'You have requested a password reset. Please click the link below to reset your password. If you did not authorize this please ignore. Someone might have entered your email mistakenly',
      user.email,
      'Forgot Password',
      user.name,
      `${process.env.FRONTEND_URL}/${resetLink}`,
      `${process.env.APP_URL}/${resetLink}`,
      'Reset Password',
    );
    return user;
  }

  async resetPassword({
    token,
    confirmPassword,
    password,
  }: ResetPasswordDto): Promise<User> {
    const verification = await this.verificationRepository.findOneByOrFail({
      token,
    });
    const createdAt = new Date(verification.createdAt).getMinutes();
    const now = new Date().getMinutes();

    const differenceInMinutes = now - createdAt;

    if (differenceInMinutes > 10) {
      throw new GoneException({
        message: 'The request for reset has expired. Please try again',
        status: 410,
      });
    }

    if (password !== confirmPassword) {
      throw new BadRequestException({
        message: 'Confirm password and password do not match',
        status: 400,
      });
    }

    const user = await this.userRepository.findOneOrFail({
      where: {
        id: verification.user.id,
      },
    });

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    return await this.userRepository.save(user);
  }
}
