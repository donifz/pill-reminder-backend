import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Guardian } from './entities/guardian.entity';
import { UsersService } from './users.service';
import { GuardianService } from './services/guardian.service';
import { GuardianController } from './controllers/guardian.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Guardian])],
  providers: [UsersService, GuardianService],
  controllers: [GuardianController],
  exports: [UsersService, GuardianService],
})
export class UsersModule {} 