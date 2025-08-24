import { Medication } from 'src/medications/entities/medication.entity';
import { Guardian } from './guardian.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { DoctorPatient } from '../../doctors/entities/doctor-patient.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ nullable: true })
  city: string;

  @OneToMany(() => Medication, medicine => medicine.user)
  medicines: Medication[];

  @OneToMany(() => Guardian, guardian => guardian.user)
  guardians: Guardian[];

  @OneToMany(() => Guardian, guardian => guardian.guardian)
  guardianFor: Guardian[];

  @OneToMany(() => DoctorPatient, doctorPatient => doctorPatient.patient)
  doctorRelations: DoctorPatient[];

  @OneToMany(() => Doctor, doctor => doctor.user)
  doctorProfile: Doctor[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 