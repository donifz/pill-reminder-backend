import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from "class-validator";

export class CreateDoctorCategoryDto {
  @ApiProperty({ description: 'The name of the doctor category' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the doctor category', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The URL of the category icon', required: false })
  @IsString()
  @IsOptional()
  iconUrl?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;
} 