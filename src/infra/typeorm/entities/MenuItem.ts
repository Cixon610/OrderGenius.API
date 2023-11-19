import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';

// @Index('menu_item_pkey', ['id'], { unique: true })
@Entity('menu_item', { schema: 'public' })
export class MenuItem {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'business_id', nullable: true })
  businessId: string | null;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', { name: 'price', nullable: true })
  price: number | null;

  @Column('json', { name: 'modification', nullable: true })
  modification: object | null;

  @Column('text', { name: 'note', nullable: true })
  note: string | null;

  @Column('boolean', {
    name: 'enable',
    nullable: false,
  })
  enable: boolean;

  @Column('boolean', {
    name: 'promoted',
    nullable: false,
  })
  promoted: boolean;

  @Column('text', { name: 'picture_url', nullable: true })
  pictureUrl: string | null;

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
