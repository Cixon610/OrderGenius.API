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

  @Column('bit', {
    name: 'enable',
    nullable: true,
    transformer: {
      to: (enable: boolean) => (enable ? 1 : 0),
      from: (enable: number) => (enable === 1 ? true : false),
    },
  })
  enable: boolean | null;

  @Column('bit', {
    name: 'promoted',
    nullable: true,
    transformer: {
      to: (enable: boolean) => (enable ? 1 : 0),
      from: (enable: number) => (enable === 1 ? true : false),
    },
  })
  promoted: boolean | null;

  @Column('text', { name: 'picture_url', nullable: true })
  pictureUrl: string | null;

  @CreateDateColumn()
  @Column('timestamp', { name: 'creation_time', nullable: true })
  creationTime: Date | null;

  @UpdateDateColumn()
  @Column('timestamp', { name: 'update_time', nullable: true })
  updateTime: Date | null;

  @Column('uuid', { name: 'update_user_id', nullable: true })
  updateUserId: string | null;
}
