import { IsString, IsNotEmpty, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicineDto {
  @ApiProperty({ description: 'Name of the medicine' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Generic name of the medicine' })
  @IsString()
  @IsNotEmpty()
  genericName: string;

  @ApiProperty({ description: 'Manufacturer of the medicine' })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({ description: 'Available dosage forms', type: [String] })
  @IsArray()
  @IsString({ each: true })
  dosageForms: string[];

  @ApiProperty({ description: 'Available doses', type: [String] })
  @IsArray()
  @IsString({ each: true })
  doses: string[];

  @ApiProperty({ description: 'Description of the medicine' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Barcode of the medicine' })
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ApiProperty({ description: 'UUID of the country where the medicine is available' })
  @IsUUID()
  countryId: string;
} 