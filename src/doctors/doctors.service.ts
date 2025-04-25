import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Doctor } from './entities/doctor.entity';
import { DoctorCategory } from './entities/doctor-category.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';

@Injectable()
export class DoctorsService extends BaseService<Doctor> {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(DoctorCategory)
    private categoriesRepository: TreeRepository<DoctorCategory>,
  ) {
    super(doctorRepository);
  }

  // Doctor Category methods
  async createCategory(
    createCategoryDto: CreateDoctorCategoryDto,
  ): Promise<DoctorCategory> {
    const category = this.categoriesRepository.create(createCategoryDto);
    if (createCategoryDto.parentId) {
      const parent = await this.categoriesRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${createCategoryDto.parentId} not found`,
        );
      }
      category.parent = parent;
    }
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<DoctorCategory[]> {
    return this.categoriesRepository.findTrees();
  }

  async findCategoryById(id: string): Promise<DoctorCategory> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Doctor methods
  async createDoctor(
    createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    const category = await this.categoriesRepository.findOne({
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