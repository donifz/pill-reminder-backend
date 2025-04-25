import { PartialType } from '@nestjs/swagger';
import { CreatePharmacyDto } from './create-pharmacy.dto';

export class UpdatePharmacyDto extends PartialType(CreatePharmacyDto) {
  location?: {
    latitude: number;
    longitude: number;
  };
} 