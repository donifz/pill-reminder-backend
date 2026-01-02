import { IsUUID, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePharmacyMedicineDto {
  @ApiProperty({ description: 'UUID of the pharmacy' })
  @IsUUID()
  pharmacyId: string;

  @ApiProperty({ description: 'UUID of the medicine' })
  @IsUUID()
  medicineId: string;

  @ApiProperty({ description: 'Price of the medicine in the pharmacy' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Stock quantity of the medicine in the pharmacy',
  })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({
    description: 'Whether the medicine is available in the pharmacy',
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Whether delivery is available for this medicine',
  })
  @IsBoolean()
  deliveryAvailable: boolean;

  @ApiProperty({
    description: 'Delivery fee for this medicine',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deliveryFee?: number;
}
