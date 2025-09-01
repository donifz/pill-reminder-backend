import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ description: 'User city', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'FCM token for notifications', required: false })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}

