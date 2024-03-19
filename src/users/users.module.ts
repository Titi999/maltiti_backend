import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Verification } from '../entities/Verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
