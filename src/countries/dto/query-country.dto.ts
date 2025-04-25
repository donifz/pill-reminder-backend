import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCountryDto {
  @ApiProperty({ description: 'Filter by country name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Filter by ISO code', required: false })
  @IsString()
  @IsOptional()
  isoCode?: string;
} 