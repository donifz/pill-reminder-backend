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

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // Doctor Category endpoints
  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createCategory(
    @Body() createCategoryDto: CreateDoctorCategoryDto,
  ): Promise<DoctorCategory> {
    return this.doctorsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  async findAllCategories(): Promise<DoctorCategory[]> {
    return this.doctorsService.findAllCategories();
  }

  @Get('categories/:id')
  async findCategoryById(@Param('id') id: string): Promise<DoctorCategory> {
    return this.doctorsService.findCategoryById(id);
  }

  // Doctor endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createDoctor(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.createDoctor(createDoctorDto);
  }

  @Get()
  async findAllDoctors(): Promise<Doctor[]> {
    return this.doctorsService.findAllDoctors();
  }

  @Get(':id')
  async findDoctorById(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findDoctorById(id);
  }

  @Get('category/:categoryId')
  async findDoctorsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Doctor[]> {
    return this.doctorsService.findDoctorsByCategory(categoryId);
  }
} 