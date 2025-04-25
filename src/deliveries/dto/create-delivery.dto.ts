import { IsUUID, IsArray, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryDto {
  @ApiProperty({ description: 'UUID of the pharmacy' })
  @IsUUID()
  pharmacyId: string;

  @ApiProperty({ description: 'Regions where delivery is available', type: [String] })
  @IsArray()
  @IsString({ each: true })
  regions: string[];

  @ApiProperty({ description: 'Minimum order amount for delivery' })
  @IsNumber()
  @Min(0)
  minOrderAmount: number;

  @ApiProperty({ description: 'Delivery fee' })
  @IsNumber()
  @Min(0)
  fee: number;

  @ApiProperty({ description: 'Estimated time of arrival in minutes' })
  @IsNumber()
  @Min(1)
  etaMinutes: number;
} 