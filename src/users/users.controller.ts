import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'The user role has been successfully updated.', type: User })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Roles(Role.ADMIN)
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<User> {
    return this.usersService.updateRole(id, updateRoleDto);
  }
} 