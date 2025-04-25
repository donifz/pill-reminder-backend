import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
import { Doctor } from './entities/doctor.entity';
import { DoctorCategory } from './entities/doctor-category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // Doctor Category endpoints
  @ApiOperation({ summary: 'Create a new doctor category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.', type: DoctorCategory })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createCategory(
    @Body() createCategoryDto: CreateDoctorCategoryDto,
  ): Promise<DoctorCategory> {
    return this.doctorsService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all doctor categories' })
  @ApiResponse({ status: 200, description: 'Return all doctor categories.', type: [DoctorCategory] })
  @Get('categories')
  async findAllCategories(): Promise<DoctorCategory[]> {
    return this.doctorsService.findAllCategories();
  }

  @ApiOperation({ summary: 'Get a doctor category by ID' })
  @ApiResponse({ status: 200, description: 'Return the doctor category.', type: DoctorCategory })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Get('categories/:id')
  async findCategoryById(@Param('id') id: string): Promise<DoctorCategory> {
    return this.doctorsService.findCategoryById(id);
  }

  // Doctor endpoints
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'The doctor has been successfully created.', type: Doctor })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createDoctor(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.createDoctor(createDoctorDto);
  }

  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Return all doctors.', type: [Doctor] })
  @Get()
  async findAllDoctors(): Promise<Doctor[]> {
    return this.doctorsService.findAllDoctors();
  }

  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Return the doctor.', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @Get(':id')
  async findDoctorById(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findDoctorById(id);
  }

  @ApiOperation({ summary: 'Get doctors by category ID' })
  @ApiResponse({ status: 200, description: 'Return all doctors in the specified category.', type: [Doctor] })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Get('category/:categoryId')
  async findDoctorsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Doctor[]> {
    return this.doctorsService.findDoctorsByCategory(categoryId);
  }
} 