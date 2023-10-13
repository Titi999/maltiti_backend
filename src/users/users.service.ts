import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterUserDto} from "../dto/registerUser.dto";
import * as bcrypt from "bcrypt";
import {User} from "../entities/User.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PasswordMismatchError} from "../utils/PasswordMismatchError";
import {IsStrongPassword, validate} from "class-validator";
import {Exclude} from "class-transformer";
import {MailerService} from "@nestjs-modules/mailer";
import * as process from "process";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private mailService: MailerService
    ) {
    }
    async create(userInfo: RegisterUserDto): Promise<User> {
        if(userInfo.password !== userInfo.confirmPassword)
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Password and confirm password do not match',
            }, HttpStatus.BAD_REQUEST);

        if(await this.findByEmail(userInfo.email))
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'User with email already exists',
            }, HttpStatus.CONFLICT);


        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userInfo.password, salt)

        const user = new User();
        user.name = userInfo.name;
        user.createdAt = new Date();
        user.password = hashedPassword;
        user.userType = userInfo.userType;
        user.email = userInfo.email;
        const validationErrors = await validate(user)
        if (validationErrors.length > 0) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: validationErrors,
            }, HttpStatus.BAD_REQUEST);
        } else {
            this.sendRegisterEmail(user.email, user.name, userInfo.password)
            return this.userRepository.save(user)
        }

    }

    sendRegisterEmail(email, name, password) {
        this.mailService.sendMail({
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
                action: 'Login'
            }
        })
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOneBy({email: email})
    }

    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne({where: {id: id}});
    }



}
