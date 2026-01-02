import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmaciesController } from './pharmacies.controller';
import { PharmaciesService } from './pharmacies.service';
import { HttpModule } from '@nestjs/axios';
import { Pharmacy } from './entities/pharmacy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy]), HttpModule],
  controllers: [PharmaciesController],
  providers: [PharmaciesService],
  exports: [PharmaciesService],
})
export class PharmaciesModule {}
