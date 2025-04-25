import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorCategory } from './entities/doctor-category.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(DoctorCategory)
    private categoriesRepository: TreeRepository<DoctorCategory>,
  ) {}

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

    const doctor = this.doctorsRepository.create({
      ...createDoctorDto,
      category,
    });

    return this.doctorsRepository.save(doctor);
  }

  async findAllDoctors(): Promise<Doctor[]> {
    return this.doctorsRepository.find({
      relations: ['category'],
    });
  }

  async findDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async findDoctorsByCategory(categoryId: string): Promise<Doctor[]> {
    return this.doctorsRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
  }
} 