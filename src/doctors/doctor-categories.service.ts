import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorCategory } from './entities/doctor-category.entity';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
import { UpdateDoctorCategoryDto } from './dto/update-doctor-category.dto';

@Injectable()
export class DoctorCategoriesService {
  constructor(
    @InjectRepository(DoctorCategory)
    private readonly doctorCategoryRepository: Repository<DoctorCategory>,
  ) {}

  async create(
    createDoctorCategoryDto: CreateDoctorCategoryDto,
  ): Promise<DoctorCategory> {
    const category = this.doctorCategoryRepository.create(
      createDoctorCategoryDto,
    );
    return await this.doctorCategoryRepository.save(category);
  }

  async findAll(): Promise<DoctorCategory[]> {
    return await this.doctorCategoryRepository.find();
  }

  async findOne(id: string): Promise<DoctorCategory> {
    const category = await this.doctorCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Doctor category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateDoctorCategoryDto: UpdateDoctorCategoryDto,
  ): Promise<DoctorCategory> {
    const category = await this.findOne(id);
    Object.assign(category, updateDoctorCategoryDto);
    return await this.doctorCategoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.doctorCategoryRepository.remove(category);
  }
}
