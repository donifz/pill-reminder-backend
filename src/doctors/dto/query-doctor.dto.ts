import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryDoctorDto extends PaginationDto {
  @ApiProperty({ description: 'Filter by doctor name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Filter by specialization', required: false })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({ description: 'Filter by country ID', required: false })
  @IsUUID()
  @IsOptional()
  countryId?: string;
}
