import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { AuthenticationService } from './authentication.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RolesGuard } from './guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { Verification } from '../entities/Verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification]),
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: String(process.env.JWT_SECRET),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    UsersService,
    RefreshTokenIdsStorage,
    LocalStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthenticationModule {}
