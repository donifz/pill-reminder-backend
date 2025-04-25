import { PartialType } from '@nestjs/swagger';
import { CreatePharmacyMedicineDto } from './create-pharmacy-medicine.dto';

export class UpdatePharmacyMedicineDto extends PartialType(CreatePharmacyMedicineDto) {} 