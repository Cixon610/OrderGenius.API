import { Column, Entity, Index } from 'typeorm';

@Index('line_account_pkey', ['id'], { unique: true })
@Index('line_account_line_id_key', ['lineId'], { unique: true })
@Entity('line_account', { schema: 'public' })
export class LineAccount {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('text', { name: 'line_id', nullable: true, unique: true })
  lineId: string | null;

  @Column('uuid', { name: 'business_user_id', nullable: true })
  businessUserId: string | null;

  @Column('text', { name: 'display_name', nullable: true })
  displayName: string | null;

  @Column('text', { name: 'picture_url', nullable: true })
  pictureUrl: string | null;

  @Column('text', { name: 'status_message', nullable: true })
  statusMessage: string | null;

  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: string | null;

  @Column('date', { name: 'update_time', nullable: true })
  updateTime: string | null;
}
