import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Medicine } from '../../medicines/entities/medicine.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('countries')
export class Country {
  @ApiProperty({ description: 'The unique identifier of the country' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The ISO code of the country (e.g., US, GB, FR)' })
  @Column({ unique: true })
  isoCode: string;

  @ApiProperty({ description: 'The full name of the country' })
  @Column()
  name: string;

  @ApiProperty({ description: 'List of medicines available in this country', type: [Medicine] })
  @OneToMany(() => Medicine, medicine => medicine.country)
  medicines: Medicine[];

  @ApiProperty({ description: 'The date when the country was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the country was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
} 