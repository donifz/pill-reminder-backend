import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Medicine } from '../../medicines/entities/medicine.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  isoCode: string;

  @Column()
  name: string;

  @OneToMany(() => Medicine, medicine => medicine.country)
  medicines: Medicine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 