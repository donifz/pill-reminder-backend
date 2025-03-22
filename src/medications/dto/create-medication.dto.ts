import { IsString, IsNumber, Min, Max, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dose: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  @Min(1)
  @Max(30)
  duration: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  takenDates?: string[];
} 