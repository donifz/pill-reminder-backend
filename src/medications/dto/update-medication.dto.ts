import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationDto } from './create-medication.dto';
import { IsOptional, IsArray } from 'class-validator';

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {
  @IsOptional()
  @IsArray()
  takenDates?: { date: string; times: string[] }[];
} 