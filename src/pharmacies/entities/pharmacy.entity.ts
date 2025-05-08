import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PharmacyMedicine } from '../../pharmacy-medicines/entities/pharmacy-medicine.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';

@Entity('pharmacies')
export class Pharmacy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column('json')
  location: {
    latitude: number;
    longitude: number;
  };

  @Column()
  contactPhone: string;

  @Column()
  contactEmail: string;

  @Column()
  openingHours: string;

  @Column()
  is24h: boolean;

  @OneToMany(() => PharmacyMedicine, pharmacyMedicine => pharmacyMedicine.pharmacy)
  pharmacyMedicines: PharmacyMedicine[];

  @OneToMany(() => Delivery, delivery => delivery.pharmacy)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 