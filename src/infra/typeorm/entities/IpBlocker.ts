import { Column, CreateDateColumn, Entity, Index } from 'typeorm';

// @Index('ip_blocker_pkey', ['id'], { unique: true })
@Entity('ip_blocker', { schema: 'public' })
export class IpBlocker {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'user_c_id', nullable: true })
  userCId: string | null;

  @Column('text', { name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column('integer', { name: 'count', nullable: true })
  count: number | null;

  @Column('bit', { name: 'enable', nullable: true })
  enable: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  creationTime: Date | null;
}
