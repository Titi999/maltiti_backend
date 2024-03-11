import {Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {IResponse} from "../interfaces/general";
import {UsersService} from "../users/users.service";
import {RegisterUserDto} from "../dto/registerUser.dto";
import {SignInDto} from "../dto/signIn.dto";
import {AuthenticationService} from "./authentication.service";

import {RefreshTokenDto} from "../dto/refreshToken.dto";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {JwtRefreshTokenGuard} from "./guards/jwt-refresh-token.guard";


@Controller('authentication')
export class AuthenticationController {
    constructor(private usersService: UsersService,
                private authService: AuthenticationService) {
    }
    @UsePipes(new ValidationPipe())
    @Post('register')
    async register (@Body() userInfo: RegisterUserDto): Promise<IResponse> {
        const user = await this.usersService.create(userInfo)
        delete user.password
        return {
            message: 'User registration successful',
            data: user
        }

    }

    @Post('login')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Get('send-email')
    async sendEmail() {
        this.authService.sendWelcomeMail()
    }

    @UseGuards(JwtRefreshTokenGuard)
    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Post('invalidate-token')
    async invalidateToken(@Req() request) {
        const authorizationHeader = request.headers.authorization
        const token = authorizationHeader.split(' ')[1];
        await this.authService.invalidateToken(token);
        return { message: 'Token invalidated successfully' };
    }

}
