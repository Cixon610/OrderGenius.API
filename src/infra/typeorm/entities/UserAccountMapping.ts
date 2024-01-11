import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_account_mapping', { schema: 'public' })
export class UserAccountMapping {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('text', { name: 'line or google' })
  entry: string;

  @Column('text', { name: '2b or 2c' })
  type: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'account_id' })
  accountId: string;

  @CreateDateColumn({
    name: 'creation_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  creationTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateTime: Date;
}
