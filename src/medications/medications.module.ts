import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { Medication } from './entities/medication.entity';
import { User } from '../users/entities/user.entity';
import { Guardian } from '../users/entities/guardian.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medication, User, Guardian]),
  ],
  controllers: [MedicationsController],
  providers: [MedicationsService],
  exports: [MedicationsService],
})
export class MedicationsModule {} 