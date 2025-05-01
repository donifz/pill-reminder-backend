import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TreeParent,
  TreeChildren,
  OneToMany,
  Tree,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('doctor_categories')
@Tree('closure-table')
export class DoctorCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  description?: string;

  @TreeParent()
  parent?: DoctorCategory;

  @TreeChildren()
  children?: DoctorCategory[];

  @OneToMany(() => Doctor, (doctor) => doctor.category)
  doctors: Doctor[];
} 