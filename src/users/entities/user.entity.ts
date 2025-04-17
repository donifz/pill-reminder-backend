import { Medication } from 'src/medications/entities/medication.entity';
import { Guardian } from './guardian.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ nullable: true })
  fcmToken: string;

  @OneToMany(() => Medication, medicine => medicine.user)
  medicines: Medication[];

  @OneToMany(() => Guardian, guardian => guardian.user)
  guardians: Guardian[];

  @OneToMany(() => Guardian, guardian => guardian.guardian)
  guardianFor: Guardian[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 