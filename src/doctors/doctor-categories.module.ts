import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorCategory } from './entities/doctor-category.entity';
import { DoctorCategoriesService } from './doctor-categories.service';
import { DoctorCategoriesController } from './doctor-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorCategory])],
  controllers: [DoctorCategoriesController],
  providers: [DoctorCategoriesService],
  exports: [DoctorCategoriesService],
})
export class DoctorCategoriesModule {} 