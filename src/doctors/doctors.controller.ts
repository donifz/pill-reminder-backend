import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
import { DoctorCategory } from './entities/doctor-category.entity';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiOperation({ summary: 'Search doctors (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Return all doctors matching the search criteria.',
    type: [Doctor],
  })
  @Get('search')
  async searchDoctors(@Query() query: QueryDoctorDto) {
    return this.doctorsService.findAll(query);
  }

  // Doctor Category endpoints - Moved before :id route
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

  @ApiOperation({ summary: 'Get doctors by category ID' })
  @ApiResponse({ status: 200, description: 'Return all doctors in the specified category.', type: [Doctor] })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Get('category/:categoryId')
  async findDoctorsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Doctor[]> {
    return this.doctorsService.findDoctorsByCategory(categoryId);
  }

  // Doctor endpoints
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({
    status: 201,
    description: 'The doctor has been successfully created.',
    type: Doctor,
  })
  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({
    status: 200,
    description: 'Return all doctors.',
    type: [Doctor],
  })
  @Get()
  async findAll(@Query() query: QueryDoctorDto) {
    return this.doctorsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Return the doctor.', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @Get(':id')
  async findDoctorById(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findDoctorById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({
    status: 200,
    description: 'The doctor has been successfully updated.',
    type: Doctor,
  })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiResponse({
    status: 200,
    description: 'The doctor has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
} 