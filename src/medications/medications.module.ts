import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { Medication } from './entities/medication.entity';
import { User } from 'src/users/entities/user.entity';
import { Guardian } from 'src/users/entities/guardian.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medication, User, Guardian])],
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {} 