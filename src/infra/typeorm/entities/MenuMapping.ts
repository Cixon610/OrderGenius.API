import { Column, CreateDateColumn, Entity, Index, UpdateDateColumn } from 'typeorm';

// @Index('menu_mapping_pkey', ['id'], { unique: true })
@Entity('menu_mapping', { schema: 'public' })
export class MenuMapping {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'menu_id', nullable: true })
  menuId: string | null;

  @Column('uuid', { name: 'menu_category_id', nullable: true })
  menuCategoryId: string | null;

  @CreateDateColumn()
  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: Date | null;

  @UpdateDateColumn()
  @Column('date', { name: 'update_time', nullable: true })
  updateTime: Date | null;

  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}