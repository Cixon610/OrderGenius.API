import { Column, CreateDateColumn, Entity, Index } from 'typeorm';

// @Index('login_log_pkey', ['id'], { unique: true })
@Entity('login_log', { schema: 'public' })
export class LoginLog {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'user_c_id', nullable: true })
  userCId: string | null;

  @Column('text', { name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column('uuid', { name: 'device_id', nullable: true })
  deviceId: string | null;

  @Column('text', { name: 'device_name', nullable: true })
  deviceName: string | null;

  @Column('text', { name: 'country_code', nullable: true })
  countryCode: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  creationTime: Date | null;
}
