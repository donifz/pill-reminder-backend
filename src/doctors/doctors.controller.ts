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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
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
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
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

  @Admin()
  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  async getAllDoctors(@Query() query: QueryDoctorDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Return the doctor with the specified ID.', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  async getDoctorById(@Param('id', ParseUUIDPipe) id: string): Promise<Doctor> {
    return this.doctorsService.findDoctorById(id);
  }

  @Admin()
  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async createDoctor(
    @Body() createDoctorDto: CreateDoctorDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    // Convert FormData arrays and objects to proper types
    if (createDoctorDto.languages && typeof createDoctorDto.languages === 'object') {
      createDoctorDto.languages = Object.values(createDoctorDto.languages);
    }
    if (createDoctorDto.location && typeof createDoctorDto.location === 'object') {
      createDoctorDto.location = {
        latitude: Number(createDoctorDto.location.latitude),
        longitude: Number(createDoctorDto.location.longitude),
      };
    }
    if (createDoctorDto.availableSlots && typeof createDoctorDto.availableSlots === 'object') {
      createDoctorDto.availableSlots = Object.values(createDoctorDto.availableSlots).map(
        (slot) => new Date(slot),
      );
    }

    // Handle photo upload
    let photoUrl = createDoctorDto.photoUrl;
    if (photo) {
      photoUrl = await this.fileUploadService.uploadDoctorPhoto(photo);
    } else if (!photoUrl) {
      // Set default photo URL if no photo is provided
      photoUrl = '/assets/images/default-doctor.jpg';
    }

    // Remove photo property from DTO
    const { photo: _, ...dtoWithoutPhoto } = createDoctorDto as any;
    return this.doctorsService.createDoctor({ ...dtoWithoutPhoto, photoUrl }, photo);
  }

  @Admin()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated successfully' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    // Convert FormData arrays and objects to proper types
    if (updateDoctorDto.languages && typeof updateDoctorDto.languages === 'object') {
      updateDoctorDto.languages = Object.values(updateDoctorDto.languages);
    }
    if (updateDoctorDto.location && typeof updateDoctorDto.location === 'object') {
      updateDoctorDto.location = {
        latitude: Number(updateDoctorDto.location.latitude),
        longitude: Number(updateDoctorDto.location.longitude),
      };
    }
    if (updateDoctorDto.availableSlots && typeof updateDoctorDto.availableSlots === 'object') {
      updateDoctorDto.availableSlots = Object.values(updateDoctorDto.availableSlots).map(
        (slot) => new Date(slot),
      );
    }

    // Handle photo upload
    let photoUrl = updateDoctorDto.photoUrl;
    if (photo) {
      // Delete old photo if exists
      const existingDoctor = await this.doctorsService.findOne(id);
      if (existingDoctor?.photoUrl) {
        await this.fileUploadService.deleteFile(existingDoctor.photoUrl);
      }
      photoUrl = await this.fileUploadService.uploadDoctorPhoto(photo);
    }

    // Remove photo property from DTO
    const { photo: _, ...dtoWithoutPhoto } = updateDoctorDto as any;
    return this.doctorsService.updateDoctor(id, { ...dtoWithoutPhoto, photoUrl }, photo);
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
    return this.doctorsService.createCategory({ ...createCategoryDto, iconUrl }, icon);
  }

  @Post('users/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a doctor profile from a user' })
  @ApiResponse({ status: 201, description: 'Doctor profile created successfully.' })
  @ApiResponse({ status: 400, description: 'User is already a doctor.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async createDoctorFromUser(
    @Param('userId') userId: string,
    @Body() createDoctorDto: CreateDoctorDto,
  ) {
    return this.doctorsService.createDoctorFromUser(userId, createDoctorDto);
  }
} 