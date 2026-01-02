import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorPatient } from './entities/doctor-patient.entity';
import { Doctor } from './entities/doctor.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class DoctorPatientsService {
  constructor(
    @InjectRepository(DoctorPatient)
    private doctorPatientRepository: Repository<DoctorPatient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async assignPatientToDoctor(
    doctorId: string,
    patientId: string,
  ): Promise<DoctorPatient> {
    // Check if doctor exists
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if patient exists and has the correct role
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (patient.role !== Role.USER) {
      throw new BadRequestException(
        'User must have the user role to be assigned as a patient',
      );
    }

    // Check if relationship already exists
    const existingRelationship = await this.doctorPatientRepository.findOne({
      where: { doctor: { id: doctorId }, patient: { id: patientId } },
    });
    if (existingRelationship) {
      throw new BadRequestException(
        'Patient is already assigned to this doctor',
      );
    }

    // Create new relationship
    const doctorPatient = this.doctorPatientRepository.create({
      doctor: { id: doctorId },
      patient: { id: patientId },
    });

    return this.doctorPatientRepository.save(doctorPatient);
  }

  async removePatientFromDoctor(
    doctorId: string,
    patientId: string,
  ): Promise<void> {
    const relationship = await this.doctorPatientRepository.findOne({
      where: { doctor: { id: doctorId }, patient: { id: patientId } },
    });

    if (!relationship) {
      throw new NotFoundException('Doctor-patient relationship not found');
    }

    await this.doctorPatientRepository.remove(relationship);
  }

  async getDoctorPatients(doctorId: string): Promise<User[]> {
    const relationships = await this.doctorPatientRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient'],
    });

    return relationships.map((rel) => rel.patient);
  }

  async getPatientDoctors(patientId: string): Promise<Doctor[]> {
    const relationships = await this.doctorPatientRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor'],
    });

    return relationships.map((rel) => rel.doctor);
  }
}
