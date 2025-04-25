import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyMedicinesController } from './pharmacy-medicines.controller';
import { PharmacyMedicinesService } from './pharmacy-medicines.service';
import { PharmacyMedicine } from './entities/pharmacy-medicine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyMedicine])],
  controllers: [PharmacyMedicinesController],
  providers: [PharmacyMedicinesService],
  exports: [PharmacyMedicinesService],
})
export class PharmacyMedicinesModule {} 