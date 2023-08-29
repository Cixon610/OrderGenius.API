import { Column, Entity, Index } from 'typeorm';

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

  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: string | null;

  @Column('date', { name: 'update_time', nullable: true })
  updateTime: string | null;
}
