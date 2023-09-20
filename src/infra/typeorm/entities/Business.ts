import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from 'typeorm';

// @Index('business_pkey', ['id'], { unique: true })
@Entity('business', { schema: 'public' })
export class Business {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'place_id', nullable: true })
  placeId: string | null;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @Column('text', { name: 'phone', nullable: true })
  phone: string | null;

  @CreateDateColumn()
  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: Date | null;

  @UpdateDateColumn()
  @Column('date', { name: 'update_time', nullable: true })
  updateTime: Date | null;
  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}
