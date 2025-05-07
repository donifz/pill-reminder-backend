import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Doctor } from './entities/doctor.entity';
import { DoctorCategory } from './entities/doctor-category.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { FileUploadService } from '../common/services/file-upload.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class DoctorsService extends BaseService<Doctor> {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(DoctorCategory)
    private readonly categoryRepository: Repository<DoctorCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
  ) {
    super(doctorRepository);
  }

  // Doctor Category methods
  async createCategory(
    createCategoryDto: CreateDoctorCategoryDto,
    icon?: Express.Multer.File,
  ): Promise<DoctorCategory> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: CreateDoctorCategoryDto,
    icon?: Express.Multer.File,
  ): Promise<DoctorCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.iconUrl) {
      await this.fileUploadService.deleteFile(category.iconUrl);
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.iconUrl) {
      await this.fileUploadService.deleteFile(category.iconUrl);
    }

    await this.categoryRepository.remove(category);
  }

  async findAllCategories(): Promise<DoctorCategory[]> {
    return this.categoryRepository.find();
  }

  async findCategoryById(id: string): Promise<DoctorCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // Doctor methods
  async createDoctor(createDoctorDto: CreateDoctorDto, photo?: Express.Multer.File): Promise<Doctor> {
    const category = await this.categoryRepository.findOne({
      where: { id: createDoctorDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      category,
      availableSlots: createDoctorDto.availableSlots || [],
    });

    return this.doctorRepository.save(doctor);
  }

  async updateDoctor(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
    photo?: Express.Multer.File,
  ): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (updateDoctorDto.categoryId && updateDoctorDto.categoryId !== doctor.category.id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateDoctorDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      doctor.category = category;
    }

    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async deleteDoctor(id: string): Promise<void> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.photoUrl) {
      await this.fileUploadService.deleteFile(doctor.photoUrl);
    }

    await this.doctorRepository.remove(doctor);
  }

  async findAllDoctors(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['category'],
    });
  }

  async findDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async findDoctorsByCategory(categoryId: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
  }

  async findAll(
    query: QueryDoctorDto,
    order = {},
    page = 1,
    limit = 10,
  ) {
    const where: any = {};
    
    if (query.name) {
      where.name = query.name;
    }
    if (query.specialization) {
      where.specialization = query.specialization;
    }
    if (query.countryId) {
      where.country = { id: query.countryId };
    }

    return super.findAll(where, order, page, limit);
  }

  async createDoctorFromUser(userId: string, createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.DOCTOR) {
      throw new BadRequestException('User is already a doctor');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: createDoctorDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Update user role to DOCTOR
    user.role = Role.DOCTOR;
    await this.userRepository.save(user);

    // Create doctor profile
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      category,
      availableSlots: createDoctorDto.availableSlots || [],
    });

    return this.doctorRepository.save(doctor);
  }
} 