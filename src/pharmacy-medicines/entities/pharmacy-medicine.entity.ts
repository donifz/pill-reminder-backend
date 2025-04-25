import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Pharmacy } from '../../pharmacies/entities/pharmacy.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';

@Entity('pharmacy_medicines')
export class PharmacyMedicine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pharmacy, pharmacy => pharmacy.pharmacyMedicines)
  pharmacy: Pharmacy;

  @ManyToOne(() => Medicine, medicine => medicine.pharmacyMedicines)
  medicine: Medicine;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stockQuantity: number;

  @Column()
  lastRestocked: Date;

  @Column()
  isAvailable: boolean;

  @Column()
  deliveryAvailable: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  deliveryFee?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 