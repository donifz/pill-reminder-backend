import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Doctor } from './doctor.entity';

@Entity('doctor_patients')
export class DoctorPatient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor, doctor => doctor.patientRelations)
  doctor: Doctor;

  @ManyToOne(() => User, user => user.doctorRelations)
  patient: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 