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
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../common/services/file-upload.service';
import { Admin } from '../auth/decorators/admin.decorator';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

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

  @Admin()
  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  async getAllDoctors(@Query() query: QueryDoctorDto) {
    return this.doctorsService.findAll(query);
  }

  @Admin()
  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async createDoctor(
    @Body() createDoctorDto: CreateDoctorDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<Doctor> {
    let photoUrl: string | undefined;
    if (photo) {
      photoUrl = await this.fileUploadService.uploadDoctorPhoto(photo);
    }
    return this.doctorsService.createDoctor({ ...createDoctorDto, photoUrl });
  }

  @Admin()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated successfully' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.updateDoctor(id, updateDoctorDto);
  }

  @Admin()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a doctor' })
  async deleteDoctor(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.doctorsService.deleteDoctor(id);
  }

  // Doctor Category endpoints
  @Admin()
  @Post('categories')
  @ApiOperation({ summary: 'Create a new doctor category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  async createCategory(
    @Body() createCategoryDto: CreateDoctorCategoryDto,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<DoctorCategory> {
    let iconUrl: string | undefined;
    if (icon) {
      iconUrl = await this.fileUploadService.uploadCategoryIcon(icon);
    }
    return this.doctorsService.createCategory({ ...createCategoryDto, iconUrl });
  }

  @Admin()
  @Post('categories/bulk')
  @ApiOperation({ summary: 'Bulk create doctor categories' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  async bulkCreateCategories(
    @Body() categories: CreateDoctorCategoryDto[],
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    let iconUrl: string | undefined;
    if (icon) {
      iconUrl = await this.fileUploadService.uploadCategoryIcon(icon);
    }
    return this.doctorsService.bulkCreateCategories(
      categories.map((category) => ({ ...category, iconUrl })),
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all doctor categories' })
  async findAllCategories(): Promise<DoctorCategory[]> {
    return this.doctorsService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get a doctor category by ID' })
  async findCategoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DoctorCategory> {
    return this.doctorsService.findCategoryById(id);
  }

  @ApiOperation({ summary: 'Get doctors by category ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all doctors in the specified category.',
    type: [Doctor],
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Get('category/:categoryId')
  async findDoctorsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Doctor[]> {
    return this.doctorsService.findDoctorsByCategory(categoryId);
  }
} 