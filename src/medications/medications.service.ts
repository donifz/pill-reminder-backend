import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private medicationsRepository: Repository<Medication>,
  ) {}

  create(createMedicationDto: CreateMedicationDto) {
    const medication = this.medicationsRepository.create(createMedicationDto);
    return this.medicationsRepository.save(medication);
  }

  findAll() {
    return this.medicationsRepository.find({
      order: {
        time: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.medicationsRepository.findOneBy({ id });
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto) {
    await this.medicationsRepository.update(id, updateMedicationDto);
    return this.findOne(id);
  }

  async toggleTaken(id: string) {
    const medication = await this.findOne(id);
    if (!medication) {
      return null;
    }
    medication.taken = !medication.taken;
    return this.medicationsRepository.save(medication);
  }

  remove(id: string) {
    return this.medicationsRepository.delete(id);
  }
} 