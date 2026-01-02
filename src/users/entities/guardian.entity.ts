import { User } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Guardian {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.guardianFor)
  guardian: User;

  @ManyToOne(() => User, (user) => user.guardians)
  user: User;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ nullable: true })
  invitationToken: string;

  @Column({ nullable: true })
  invitationExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
