import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from 'typeorm';

// @Index('menu_category_pkey', ['id'], { unique: true })
@Entity('menu_category', { schema: 'public' })
export class MenuCategory {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'business_id', nullable: true })
  businessId: string | null;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('text', { name: 'picture_url', nullable: true })
  pictureUrl: string | null;

  @CreateDateColumn()
  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: Date | null;

  @UpdateDateColumn()
  @Column('date', { name: 'update_time', nullable: true })
  updateTime: Date | null;

  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}
