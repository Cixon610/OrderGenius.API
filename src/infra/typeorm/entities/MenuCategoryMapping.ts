import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';

// @Index('menu_mapping_pkey', ['id'], { unique: true })
@Entity('menu_category_mapping', { schema: 'public' })
export class MenuCategoryMapping {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'menu_category_id', nullable: true })
  menuCategoryId: string | null;

  @Column('uuid', { name: 'menu_item_id', nullable: true })
  menuItemId: string | null;

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

  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}
