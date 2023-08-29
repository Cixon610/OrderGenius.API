import { Column, Entity, Index } from 'typeorm';

@Index('menu_pkey', ['id'], { unique: true })
@Entity('menu', { schema: 'public' })
export class Menu {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'business_id', nullable: true })
  businessId: string | null;

  @Column('json', { name: 'content', nullable: true })
  content: object | null;

  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: string | null;

  @Column('date', { name: 'update_time', nullable: true })
  updateTime: string | null;

  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}
