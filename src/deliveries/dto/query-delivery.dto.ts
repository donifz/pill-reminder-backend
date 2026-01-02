import { IsOptional, IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDeliveryDto {
  @ApiProperty({ description: 'Filter by pharmacy ID', required: false })
  @IsUUID()
  @IsOptional()
  pharmacyId?: string;

  @ApiProperty({ description: 'Filter by region', required: false })
  @IsString()
  @IsOptional()
  region?: string;
}
