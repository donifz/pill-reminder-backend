import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
  async createDoctor(
    createDoctorDto: CreateDoctorDto,
    photo?: Express.Multer.File,
  ): Promise<Doctor> {
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

    if (
      updateDoctorDto.categoryId &&
      updateDoctorDto.categoryId !== doctor.category.id
    ) {
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

  async findDoctorById(id: string): Promise<any> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return {
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      email: doctor.contactEmail,
      phone: doctor.contactPhone,
      specialization: doctor.specialization,
      experience: doctor.yearsExperience,
      rating:
        doctor.rating !== undefined && doctor.rating !== null
          ? Number(doctor.rating)
          : 0,
      city: doctor.city || '',
      country: 'Unknown', // You might want to add country field to the entity
      image: doctor.photoUrl,
      category: doctor.category
        ? {
            id: doctor.category.id,
            name: doctor.category.name,
          }
        : null,
      bio: doctor.bio,
      languages: doctor.languages,
      consultationFee: doctor.consultationFee,
      clinicAddress: doctor.clinicAddress,
      location: doctor.location,
      availableSlots: doctor.availableSlots,
      reviewsCount: doctor.reviewsCount,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }

  async findDoctorsByCategory(categoryId: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
  }

  async findAll(query: QueryDoctorDto, order = {}, page = 1, limit = 10) {
    // Use pagination parameters from query if provided
    const currentPage = query.page || page;
    const currentLimit = query.limit || limit;
    const skip = (currentPage - 1) * currentLimit;

    // Build query with conditions
    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.category', 'category');

    if (query.name) {
      queryBuilder.where(
        'doctor.firstName LIKE :name OR doctor.lastName LIKE :name',
        { name: `%${query.name}%` },
      );
    }

    if (query.specialization) {
      queryBuilder.andWhere('doctor.specialization LIKE :specialization', {
        specialization: `%${query.specialization}%`,
      });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(currentLimit)
      .getManyAndCount();

    return { items, total };
  }

  async searchDoctors(query: QueryDoctorDto, order = {}, page = 1, limit = 10) {
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

    const skip = (page - 1) * limit;
    const [items, total] = await this.doctorRepository.findAndCount({
      where,
      order,
      skip,
      take: limit,
      relations: ['category'],
    });

    // Transform the data to match frontend expectations
    const transformedItems = items.map((doctor) => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      email: doctor.contactEmail,
      phone: doctor.contactPhone,
      specialization: doctor.specialization,
      experience: doctor.yearsExperience,
      rating:
        doctor.rating !== undefined && doctor.rating !== null
          ? Number(doctor.rating)
          : 0,
      city: doctor.city || '',
      country: 'Unknown', // You might want to add country field to the entity
      image: doctor.photoUrl,
      category: {
        id: doctor.category.id,
        name: doctor.category.name,
      },
    }));

    return { items: transformedItems, total };
  }

  async createDoctorFromUser(
    userId: string,
    createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a doctor profile
    const existingDoctor = await this.doctorRepository.findOne({
      where: { userId: userId },
      relations: ['category'],
    });

    if (existingDoctor) {
      throw new BadRequestException('User already has a doctor profile');
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

    // Create doctor profile using user data as base
    const doctor = this.doctorRepository.create({
      // Use user data for basic information
      firstName: user.name.split(' ')[0] || user.name,
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      contactEmail: user.email,
      city: user.city || '',

      // Use provided doctor-specific data
      specialization: createDoctorDto.specialization,
      yearsExperience: createDoctorDto.yearsExperience,
      photoUrl: createDoctorDto.photoUrl || '',
      bio: createDoctorDto.bio,
      languages: createDoctorDto.languages || [],
      consultationFee: createDoctorDto.consultationFee,
      contactPhone: createDoctorDto.contactPhone,
      clinicAddress: createDoctorDto.clinicAddress,
      location: createDoctorDto.location,
      availableSlots: createDoctorDto.availableSlots || [],

      // Relationships
      category,
      user,
      userId,
    });

    return this.doctorRepository.save(doctor);
  }

  async getUserDataForDoctor(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a doctor profile
    const existingDoctor = await this.doctorRepository.findOne({
      where: { userId: userId },
    });

    if (existingDoctor) {
      throw new BadRequestException('User already has a doctor profile');
    }

    // Return user data for pre-filling doctor form
    const nameParts = user.name.split(' ');
    return {
      firstName: nameParts[0] || user.name,
      lastName: nameParts.slice(1).join(' ') || '',
      contactEmail: user.email,
      city: user.city || '',
      userId: user.id,
    };
  }
}
