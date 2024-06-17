import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';

// @Index('order_pkey', ['id'], { unique: true })
@Entity('order', { schema: 'public' })
export class Order {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'user_c_id', nullable: true })
  userCId: string | null;

  @Column('uuid', { name: 'message_id', nullable: true })
  messageId: string | null;

  @Column('integer', { name: 'total_value', nullable: true })
  totalValue: number | null;

  @Column('integer', { name: 'total_count', nullable: true })
  totalCount: number | null;

  @Column('text', { name: 'memo', nullable: true })
  memo: string | null;

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

  @Column('text', { name: 'business_id', nullable: true })
  businessId: string | null;

  @Column('text', { name: 'table_no', nullable: true })
  tableNo: string | null;

  @Column('integer', { name: 'status', nullable: true })
  status: number | null;
}
