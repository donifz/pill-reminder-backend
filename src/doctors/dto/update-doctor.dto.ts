import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;
} 