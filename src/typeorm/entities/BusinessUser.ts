import { Column, Entity, Index } from 'typeorm';

// @Index('business_user_pkey', ['id'], { unique: true })
@Entity('business_user', { schema: 'public' })
export class BusinessUser {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'business_id', nullable: true })
  businessId: string | null;

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
