import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DoctorCategory } from './doctor-category.entity';
import { DoctorPatient } from './doctor-patient.entity';
import { User } from '../../users/entities/user.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => DoctorCategory, category => category.doctors)
  category: DoctorCategory;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column()
  photoUrl: string;

  @Column()
  specialization: string;

  @Column()
  yearsExperience: number;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ nullable: true })
  reviewsCount: number;

  @Column('text')
  bio: string;

  @Column('simple-array')
  languages: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  consultationFee: number;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;

  @Column()
  clinicAddress: string;

  @Column({ nullable: true })
  city: string;

  @Column('json')
  location: {
    latitude: number;
    longitude: number;
  };

  @Column('simple-array')
  availableSlots: Date[];

  @OneToMany(() => DoctorPatient, doctorPatient => doctorPatient.doctor)
  patientRelations: DoctorPatient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 