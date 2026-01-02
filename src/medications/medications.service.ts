import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { User } from 'src/users/entities/user.entity';
import { Guardian } from 'src/users/entities/guardian.entity';

@Injectable()
export class MedicationsService {
  private readonly logger = new Logger(MedicationsService.name);

  constructor(
    @InjectRepository(Medication)
    private medicationsRepository: Repository<Medication>,
    @InjectRepository(Guardian)
    private guardianRepository: Repository<Guardian>,
  ) {}

  create(dto: CreateMedicationDto, user: User) {
    const medication = this.medicationsRepository.create({
      ...dto,
      takenDates: [],
      user,
    });
    return this.medicationsRepository.save(medication);
  }

  async findAll(user: User) {
    // Get medications for the user
    const userMedications = await this.medicationsRepository.find({
      where: { user: { id: user.id } },
      order: {
        times: 'ASC',
        createdAt: 'DESC',
      },
    });

    // Get medications for users where the current user is a guardian
    const guardianRelationships = await this.guardianRepository.find({
      where: {
        guardian: { id: user.id },
        isAccepted: true,
      },
      relations: ['user'],
    });

    const guardianMedications = await Promise.all(
      guardianRelationships.map(async (relationship) => {
        const medications = await this.medicationsRepository.find({
          where: { user: { id: relationship.user.id } },
          order: {
            times: 'ASC',
            createdAt: 'DESC',
          },
        });
        return {
          user: {
            id: relationship.user.id,
            name: relationship.user.name,
            email: relationship.user.email,
          },
          medications,
        };
      }),
    );

    return {
      userMedications,
      guardianMedications,
    };
  }

  async findOne(id: string, user: User) {
    const medication = await this.medicationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    // Check if user owns the medication or is a guardian
    if (medication.user.id !== user.id) {
      const guardianRelationship = await this.guardianRepository.findOne({
        where: {
          guardian: { id: user.id },
          user: { id: medication.user.id },
          isAccepted: true,
        },
      });

      if (!guardianRelationship) {
        throw new ForbiddenException(
          'You do not have access to this medication',
        );
      }
    }

    return medication;
  }

  async update(
    id: string,
    updateMedicationDto: UpdateMedicationDto,
    user: User,
  ) {
    const medication = await this.findOne(id, user);

    const updatedMedication = {
      ...medication,
      ...updateMedicationDto,
    };

    return this.medicationsRepository.save(updatedMedication);
  }

  async toggleTaken(id: string, date: string, time: string, user: User) {
    const medication = await this.findOne(id, user);

    const takenDates = medication.takenDates || [];
    const existingDateIndex = takenDates.findIndex((td) => td.date === date);

    if (existingDateIndex >= 0) {
      const existingDate = takenDates[existingDateIndex];
      if (existingDate.times.includes(time)) {
        existingDate.times = existingDate.times.filter((t) => t !== time);
        if (existingDate.times.length === 0) {
          takenDates.splice(existingDateIndex, 1);
        }
      } else {
        existingDate.times.push(time);
        existingDate.times.sort();
      }
    } else {
      takenDates.push({ date, times: [time] });
      takenDates.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    medication.taken = takenDates.length > 0;
    medication.takenDates = takenDates;

    return this.medicationsRepository.save(medication);
  }

  async remove(id: string, user: User) {
    const medication = await this.findOne(id, user);
    return this.medicationsRepository.remove(medication);
  }

  async findMedicationsByTime(time: string): Promise<Medication[]> {
    const today = new Date().toISOString().split('T')[0];

    this.logger.log(
      `[DEBUG] Finding medications for time: ${time} on date: ${today}`,
    );

    // First, let's check all medications to see what we have
    const allMedications = await this.medicationsRepository.find();
    this.logger.log(
      `[DEBUG] Total medications in database: ${allMedications.length}`,
    );

    allMedications.forEach((med) => {
      this.logger.log(
        `[DEBUG] Medication: ${med.name}, Times: ${med.times.join(', ')}, Start: ${med.startDate}, End: ${med.endDate}`,
      );
    });

    // Now let's build the query step by step to see where medications are being filtered out
    const query = this.medicationsRepository
      .createQueryBuilder('medication')
      .leftJoinAndSelect('medication.user', 'user');

    // Check medications with matching time
    const timeQuery = query
      .clone()
      .where('medication.times LIKE :time', { time: `%${time}%` });
    const timeMatches = await timeQuery.getMany();
    this.logger.log(
      `[DEBUG] Medications matching time ${time}: ${timeMatches.length}`,
    );

    // Check medications within date range
    const dateQuery = query
      .clone()
      .where('medication.startDate <= :today', { today })
      .andWhere('medication.endDate >= :today', { today });
    const dateMatches = await dateQuery.getMany();
    this.logger.log(
      `[DEBUG] Medications within date range: ${dateMatches.length}`,
    );

    // Check medications not taken today
    const takenDate = JSON.stringify({ date: today, times: [time] });
    const notTakenQuery = query
      .clone()
      .where(
        '(medication.takendates IS NULL OR NOT medication.takendates::jsonb @> :takenDate)',
        {
          takenDate,
        },
      );
    const notTakenMatches = await notTakenQuery.getMany();
    this.logger.log(
      `[DEBUG] Medications not taken today: ${notTakenMatches.length}`,
    );

    // Now run the complete query
    const medications = await query
      .where('medication.times LIKE :time', { time: `%${time}%` })
      .andWhere('medication.startDate <= :today', { today })
      .andWhere('medication.endDate >= :today', { today })
      .andWhere(
        '(medication.takendates IS NULL OR NOT medication.takendates::jsonb @> :takenDate)',
        {
          takenDate,
        },
      )
      .getMany();

    this.logger.log(`[DEBUG] Final medications found: ${medications.length}`);
    medications.forEach((med) => {
      this.logger.log(
        `[DEBUG] Final medication: ${med.name}, Times: ${med.times.join(', ')}, Start: ${med.startDate}, End: ${med.endDate}`,
      );
    });

    return medications;
  }
}
