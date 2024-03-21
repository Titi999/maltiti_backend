import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private mailService: MailerService,
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
      to: 'abubakaribilal99@gmail.com',
      from: 'abubakaribilal99@gmail.com',
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

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
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
}
