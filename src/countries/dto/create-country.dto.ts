import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ description: 'ISO code of the country' })
  @IsString()
  @IsNotEmpty()
  isoCode: string;

  @ApiProperty({ description: 'Name of the country' })
  @IsString()
  @IsNotEmpty()
  name: string;
} 