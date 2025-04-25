import { IsString, IsNumber, IsEmail, IsArray, IsUUID, IsObject, ValidateNested, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class CreateDoctorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  photoUrl: string;

  @IsString()
  specialization: string;

  @IsNumber()
  @Min(0)
  yearsExperience: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNumber()
  @Min(0)
  reviewsCount: number;

  @IsString()
  bio: string;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsNumber()
  @Min(0)
  consultationFee: number;

  @IsEmail()
  contactEmail: string;

  @IsString()
  contactPhone: string;

  @IsString()
  clinicAddress: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @IsOptional()
  availableSlots?: Date[];
} 