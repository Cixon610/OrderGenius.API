import { Column, Entity, Index } from 'typeorm';

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

  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: string | null;

  @Column('date', { name: 'update_time', nullable: true })
  updateTime: string | null;
}
