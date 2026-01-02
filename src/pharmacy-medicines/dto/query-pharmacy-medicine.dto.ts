import {
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPharmacyMedicineDto {
  @ApiProperty({ description: 'Filter by pharmacy ID', required: false })
  @IsUUID()
  @IsOptional()
  pharmacyId?: string;

  @ApiProperty({ description: 'Filter by medicine ID', required: false })
  @IsUUID()
  @IsOptional()
  medicineId?: string;

  @ApiProperty({
    description: 'Filter by delivery availability',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  deliveryAvailable?: boolean;

  @ApiProperty({ description: 'Minimum price filter', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ description: 'Maximum price filter', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({ description: 'Filter by availability', required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
