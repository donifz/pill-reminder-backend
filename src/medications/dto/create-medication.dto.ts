import { IsString, IsArray, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsString()
  dose: string;

  @IsArray()
  @IsString({ each: true })
  times: string[];

  @IsNumber()
  @Min(1)
  @Max(30)
  duration: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  takenDates?: { date: string; times: string[] }[];
} 