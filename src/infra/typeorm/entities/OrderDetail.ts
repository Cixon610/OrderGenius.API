import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from 'typeorm';

// @Index('order_detail_pkey', ['id'], { unique: true })
@Entity('order_detail', { schema: 'public' })
export class OrderDetail {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'order_id', nullable: true })
  orderId: string | null;

  @Column('uuid', { name: 'item_id', nullable: true })
  itemId: string | null;

  @Column('numeric', { name: 'item_price', nullable: true })
  itemPrice: Number | null;

  @Column('numeric', { name: 'total_price', nullable: true })
  totalPrice: Number | null;

  @Column('json', { name: 'modification', nullable: true })
  modification: object | null;

  @Column('text', { name: 'memo', nullable: true })
  memo: string | null;

  @CreateDateColumn()
  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: Date | null;

  @UpdateDateColumn()
  @Column('date', { name: 'update_time', nullable: true })
  updateTime: Date | null;
}
