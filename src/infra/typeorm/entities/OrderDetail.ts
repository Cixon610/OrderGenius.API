import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';

// @Index('order_detail_pkey', ['id'], { unique: true })
@Entity('order_detail', { schema: 'public' })
export class OrderDetail {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'order_id', nullable: true })
  orderId: string | null;

  @Column('uuid', { name: 'item_id', nullable: true })
  itemId: string | null;

  @Column('integer', { name: 'item_price', nullable: true })
  itemPrice: number | null;

  @Column('integer', { name: 'total_price', nullable: true })
  totalPrice: number | null;

  @Column('json', { name: 'modification', nullable: true })
  modification: object | null;

  @Column('integer', { name: 'count' })
  count: number | null;

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
}
