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
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ description: 'Latitude coordinate of the doctor\'s location' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate of the doctor\'s location' })
  @IsNumber()
  longitude: number;
}

export class CreateDoctorDto {
  @ApiProperty({ description: 'Doctor\'s first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Doctor\'s last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'UUID of the doctor\'s category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'URL to the doctor\'s profile photo' })
  @IsString()
  photoUrl: string;

  @ApiProperty({ description: 'Doctor\'s area of specialization' })
  @IsString()
  specialization: string;

  @ApiProperty({ description: 'Number of years of experience', minimum: 0 })
  @IsNumber()
  @Min(0)
  yearsExperience: number;

  @ApiProperty({
    description: 'Doctor\'s rating out of 5',
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Number of reviews received', minimum: 0 })
  @IsNumber()
  @Min(0)
  reviewsCount: number;

  @ApiProperty({ description: 'Doctor\'s professional biography' })
  @IsString()
  bio: string;

  @ApiProperty({
    description: 'Languages spoken by the doctor',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ description: 'Fee charged for consultation', minimum: 0 })
  @IsNumber()
  @Min(0)
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

  @ApiProperty({
    description: 'Geographic location of the doctor\'s clinic',
    type: LocationDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Available appointment slots',
    type: [Date],
    required: false,
  })
  @IsArray()
  @IsOptional()
  availableSlots?: Date[];
} 