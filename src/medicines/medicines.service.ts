import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicinesService extends BaseService<Medicine> {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {
    super(medicineRepository);
  }

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    try {
      // Check if medicine with same barcode exists
      const existingMedicine = await this.medicineRepository.findOne({
        where: { barcode: createMedicineDto.barcode },
      });

      if (existingMedicine) {
        throw new ConflictException({
          message: 'Medicine with this barcode already exists',
          details: {
            barcode: createMedicineDto.barcode,
            existingMedicine: {
              id: existingMedicine.id,
              name: existingMedicine.name,
              genericName: existingMedicine.genericName,
              manufacturer: existingMedicine.manufacturer,
            },
          },
        });
      }

      return super.create(createMedicineDto);
    } catch (error) {
      // Check if it's a database constraint violation
      if (error.code === '23505') {
        // This is a unique constraint violation
        const existingMedicine = await this.medicineRepository.findOne({
          where: { barcode: createMedicineDto.barcode },
        });

        if (existingMedicine) {
          throw new ConflictException({
            message: 'Medicine with this barcode already exists',
            details: {
              barcode: createMedicineDto.barcode,
              existingMedicine: {
                id: existingMedicine.id,
                name: existingMedicine.name,
                genericName: existingMedicine.genericName,
                manufacturer: existingMedicine.manufacturer,
              },
            },
          });
        }
      }

      // Re-throw the original error if it's not a constraint violation
      throw error;
    }
  }
}
