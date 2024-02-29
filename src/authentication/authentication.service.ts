import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/User.entity";
import {SignInDto} from "../dto/signIn.dto";
import {UsersService} from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { MailerService} from "@nestjs-modules/mailer";
import {RefreshTokenIdsStorage} from "./refresh-token-ids-storage";
import {Repository} from "typeorm";
import {JwtRefreshTokenStrategy} from "./strategy/jwt-refresh-token.strategy";

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(JwtRefreshTokenStrategy.name);
    constructor(
        @InjectRepository(User)
        private readonly authenticationRepository: Repository<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailerService,
        private refreshTokenIdsStorage: RefreshTokenIdsStorage,
    ) {
    }

    async signIn(signInfo: SignInDto) {
        const { email, password } = signInfo;

        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const passwordIsValid = await user.validatePassword(password);

        if (!passwordIsValid) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1d',
        });

        // Store the refresh token in redis
        await this.refreshTokenIdsStorage.insert(user.id, refreshToken);
        delete user.password
        return {
            message: 'You have successfully logged in',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: user
            }
        };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await user.validatePassword(password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    sendWelcomeMail() {
        this.mailService.sendMail({
           to: 'abubakaribilal99@gmail.com',
           from: 'noreply@maltitiaenterprise.com',
            subject: 'Welcome on board',
            template: './welcome',
            context: {
               name: 'Bilal',
                url: 'http://',
                subject: 'Welcome on board',
                body: 'Welcome to Maltiti A. Enterprise Ltd. We are pleased to have you here. Click the link below to to log in and access our wonderful resources. Welcome once again',
                link: 'Login',
                action: 'Login'
            }
        })
    }

    async refreshAccessToken(
        refreshToken: string,
    ): Promise<{ access_token: string }> {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            await this.refreshTokenIdsStorage.validate(decoded.sub, refreshToken);
            const payload = { sub: decoded.sub, username: decoded.username };
            const accessToken = await this.jwtService.signAsync(payload);
            return { access_token: accessToken };
        } catch (error) {
            this.logger.error(`Error: ${error.message}`);
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async invalidateToken(accessToken: string): Promise<void> {
        try {
            const decoded = await this.jwtService.verifyAsync(accessToken);
            await this.refreshTokenIdsStorage.invalidate(decoded.sub);
        } catch (error) {
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
