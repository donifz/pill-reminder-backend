import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { PharmacyMedicine } from './entities/pharmacy-medicine.entity';
import { CreatePharmacyMedicineDto } from './dto/create-pharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/update-pharmacy-medicine.dto';
import { QueryPharmacyMedicineDto } from './dto/query-pharmacy-medicine.dto';

@Injectable()
export class PharmacyMedicinesService extends BaseService<PharmacyMedicine> {
  constructor(
    @InjectRepository(PharmacyMedicine)
    private readonly pharmacyMedicineRepository: Repository<PharmacyMedicine>,
  ) {
    super(pharmacyMedicineRepository);
  }

  async create(
    createPharmacyMedicineDto: CreatePharmacyMedicineDto,
  ): Promise<PharmacyMedicine> {
    const pharmacyMedicine = this.pharmacyMedicineRepository.create(
      createPharmacyMedicineDto,
    );
    return await this.pharmacyMedicineRepository.save(pharmacyMedicine);
  }

  async findAll(
    query: QueryPharmacyMedicineDto,
    order: FindOptionsOrder<PharmacyMedicine> = {},
    page = 1,
    limit = 10,
  ) {
    const where: FindOptionsWhere<PharmacyMedicine> = {};

    if (query.pharmacyId) {
      where.pharmacy = { id: query.pharmacyId };
    }
    if (query.medicineId) {
      where.medicine = { id: query.medicineId };
    }
    if (query.isAvailable !== undefined) {
      where.isAvailable = query.isAvailable;
    }

    return super.findAll(where, order, page, limit);
  }

  async findOne(id: string): Promise<PharmacyMedicine> {
    const pharmacyMedicine = await this.pharmacyMedicineRepository.findOne({
      where: { id },
    });
    if (!pharmacyMedicine) {
      throw new NotFoundException(
        `Pharmacy medicine with ID "${id}" not found`,
      );
    }
    return pharmacyMedicine;
  }

  async update(
    id: string,
    updatePharmacyMedicineDto: UpdatePharmacyMedicineDto,
  ): Promise<PharmacyMedicine> {
    const pharmacyMedicine = await this.findOne(id);
    Object.assign(pharmacyMedicine, updatePharmacyMedicineDto);
    return await this.pharmacyMedicineRepository.save(pharmacyMedicine);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pharmacyMedicineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Pharmacy medicine with ID "${id}" not found`,
      );
    }
  }
}
