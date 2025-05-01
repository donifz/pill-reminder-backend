import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class DoctorsService extends BaseService<Doctor> {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(DoctorCategory)
    private readonly categoryRepository: Repository<DoctorCategory>,
    private readonly fileUploadService: FileUploadService,
  ) {
    super(doctorRepository);
  }

  // Doctor Category methods
  async createCategory(
    createCategoryDto: CreateDoctorCategoryDto,
  ): Promise<DoctorCategory> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async bulkCreateCategories(
    categories: CreateDoctorCategoryDto[],
  ): Promise<DoctorCategory[]> {
    const createdCategories = categories.map((category) =>
      this.categoryRepository.create(category),
    );
    return this.categoryRepository.save(createdCategories);
  }

  async findAllCategories(): Promise<DoctorCategory[]> {
    return this.categoryRepository.find();
  }

  async findCategoryById(id: string): Promise<DoctorCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    if (category.iconUrl) {
      await this.fileUploadService.deleteCategoryIcon(category.iconUrl);
    }
    await this.categoryRepository.remove(category);
  }

  // Doctor methods
  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const category = await this.categoryRepository.findOne({
      where: { id: createDoctorDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createDoctorDto.categoryId} not found`,
      );
    }

    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      category,
    });

    return this.doctorRepository.save(doctor);
  }

  async updateDoctor(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }

    // If there's a new photo, delete the old one
    if (updateDoctorDto.photoUrl && doctor.photoUrl) {
      await this.fileUploadService.deleteDoctorPhoto(doctor.photoUrl);
    }

    // If category is being updated, verify it exists
    if (updateDoctorDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateDoctorDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateDoctorDto.categoryId} not found`,
        );
      }
      doctor.category = category;
    }

    // Update other fields
    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async deleteDoctor(id: string): Promise<void> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }

    // Delete the doctor's photo if it exists
    if (doctor.photoUrl) {
      await this.fileUploadService.deleteDoctorPhoto(doctor.photoUrl);
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
} 