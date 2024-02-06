import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('modification')
export class Modification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'business_id' })
  businessId: string | null;

  @Column('text', { name: 'name' })
  name: string | null;

  @Column('json', { name: 'options' })
  options: Record<string, number> | null;

  @Column('integer', { name: 'max_choices' })
  maxChoices?: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date | null;

  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}
