import { IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPharmacyDto {
  @ApiProperty({
    description: 'Latitude coordinate for radius search',
    required: false,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate for radius search',
    required: false,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Radius in meters for search', required: false })
  @IsNumber()
  @Min(100)
  @IsOptional()
  radius?: number;

  @ApiProperty({
    description: 'Filter by 24-hour availability',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is24h?: boolean;
}
