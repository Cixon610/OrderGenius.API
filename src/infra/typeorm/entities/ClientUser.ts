import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from 'typeorm';

// @Index('client_user_pkey', ['id'], { unique: true })
@Entity('client_user', { schema: 'public' })
export class ClientUser {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('text', { name: 'user_name', nullable: true })
  userName: string | null;

  @Column('text', { name: 'account', nullable: true })
  account: string | null;

  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @Column('text', { name: 'email', nullable: true })
  email: string | null;

  @Column('text', { name: 'phone', nullable: true })
  phone: string | null;

  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  creationTime: Date | null;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateTime: Date | null;

}
