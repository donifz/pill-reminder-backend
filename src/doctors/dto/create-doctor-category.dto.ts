import { IsString, IsOptional, IsUUID } from "class-validator";

export class CreateDoctorCategoryDto {
  @IsString()
  name: string;

  @IsString()
  iconUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;
} 