import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePharmacyDto {
  @ApiProperty({ description: 'Name of the pharmacy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Address of the pharmacy' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City where the pharmacy is located' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Latitude coordinate of the pharmacy location' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate of the pharmacy location' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ description: 'Contact phone number of the pharmacy' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiProperty({ description: 'Contact email of the pharmacy' })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiProperty({ description: 'Opening hours of the pharmacy' })
  @IsString()
  @IsNotEmpty()
  openingHours: string;

  @ApiProperty({ description: 'Whether the pharmacy is open 24 hours' })
  @IsBoolean()
  is24h: boolean;
}
