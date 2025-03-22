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
    const medication = this.medicationsRepository.create({
      ...createMedicationDto,
      takenDates: [],
    });
    return this.medicationsRepository.save(medication);
  }

  findAll() {
    return this.medicationsRepository.find({
      order: {
        times: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.medicationsRepository.findOneBy({ id });
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto) {
    const medication = await this.findOne(id);
    if (!medication) {
      return null;
    }
    
    const updatedMedication = {
      ...medication,
      ...updateMedicationDto,
    };
    
    return this.medicationsRepository.save(updatedMedication);
  }

  async toggleTaken(id: string, date: string, time: string) {
    const medication = await this.findOne(id);
    if (!medication) {
      return null;
    }

    const takenDates = medication.takenDates || [];
    const existingDateIndex = takenDates.findIndex(td => td.date === date);

    if (existingDateIndex >= 0) {
      const existingDate = takenDates[existingDateIndex];
      if (existingDate.times.includes(time)) {
        existingDate.times = existingDate.times.filter(t => t !== time);
        if (existingDate.times.length === 0) {
          takenDates.splice(existingDateIndex, 1);
        }
      } else {
        existingDate.times.push(time);
        existingDate.times.sort();
      }
    } else {
      takenDates.push({ date, times: [time] });
      takenDates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    medication.taken = takenDates.length > 0;
    medication.takenDates = takenDates;

    return this.medicationsRepository.save(medication);
  }

  remove(id: string) {
    return this.medicationsRepository.delete(id);
  }
} 