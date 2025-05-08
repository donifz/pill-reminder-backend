import {
  IsString,
  IsNumber,
  IsEmail,
  IsArray,
  IsUUID,
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

class LocationDto {
  @ApiProperty({ description: 'Latitude coordinate of the doctor\'s location' })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate of the doctor\'s location' })
  @IsNumber()
  @Type(() => Number)
  longitude: number;
}

export class CreateDoctorDto {
  @Exclude()
  photo?: Express.Multer.File;

  @ApiProperty({ description: 'Doctor\'s first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Doctor\'s last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'UUID of the doctor\'s category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: "URL or relative path to the doctor's profile photo",
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ description: 'Doctor\'s area of specialization' })
  @IsString()
  specialization: string;

  @ApiProperty({ description: 'Number of years of experience', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  yearsExperience: number;

  @ApiProperty({
    description: 'Doctor\'s rating out of 5',
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiProperty({
    description: 'Number of reviews received',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reviewsCount?: number;

  @ApiProperty({ description: 'Doctor\'s professional biography' })
  @IsString()
  bio: string;

  @ApiProperty({
    description: 'Languages spoken by the doctor',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Type(() => Array)
  languages: string[];

  @ApiProperty({ description: 'Fee charged for consultation', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  consultationFee: number;

  @ApiProperty({ description: 'Doctor\'s contact email address' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ description: 'Doctor\'s contact phone number' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ description: 'Physical address of the doctor\'s clinic' })
  @IsString()
  clinicAddress: string;

  @ApiProperty({ description: 'City where the doctor practices' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Location coordinates' })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Available consultation slots',
    type: [Date],
  })
  @IsArray()
  @Type(() => Date)
  availableSlots: Date[];
} 