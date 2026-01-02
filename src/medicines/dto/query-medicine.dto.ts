import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryMedicineDto {
  @ApiProperty({ description: 'Filter by medicine name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Filter by generic name', required: false })
  @IsString()
  @IsOptional()
  genericName?: string;

  @ApiProperty({ description: 'Filter by country ID', required: false })
  @IsUUID()
  @IsOptional()
  countryId?: string;

  @ApiProperty({
    description: 'Filter by availability in pharmacies',
    required: false,
  })
  @IsOptional()
  isAvailable?: boolean;
}
