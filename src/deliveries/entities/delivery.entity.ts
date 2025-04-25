import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Pharmacy } from '../../pharmacies/entities/pharmacy.entity';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pharmacy, pharmacy => pharmacy.deliveries)
  pharmacy: Pharmacy;

  @Column('simple-array')
  regions: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  minOrderAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  fee: number;

  @Column()
  etaMinutes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 