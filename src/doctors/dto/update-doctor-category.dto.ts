import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorCategoryDto } from './create-doctor-category.dto';

export class UpdateDoctorCategoryDto extends PartialType(CreateDoctorCategoryDto) {} 