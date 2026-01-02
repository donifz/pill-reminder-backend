import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { PharmacyMedicine } from '../../pharmacy-medicines/entities/pharmacy-medicine.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('medicines')
export class Medicine extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the medicine' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Generic name of the medicine' })
  @Column()
  genericName: string;

  @ApiProperty({ description: 'Manufacturer of the medicine' })
  @Column()
  manufacturer: string;

  @ApiProperty({ description: 'Available dosage forms' })
  @Column('simple-array')
  dosageForms: string[];

  @ApiProperty({ description: 'Available doses' })
  @Column('simple-array')
  doses: string[];

  @ApiProperty({ description: 'Description of the medicine' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Barcode of the medicine' })
  @Column({ unique: true })
  barcode: string;

  @ApiProperty({
    description: 'UUID of the country where the medicine is available',
  })
  @ManyToOne(() => Country, (country) => country.medicines)
  country: Country;

  @OneToMany(
    () => PharmacyMedicine,
    (pharmacyMedicine) => pharmacyMedicine.medicine,
  )
  pharmacyMedicines: PharmacyMedicine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
