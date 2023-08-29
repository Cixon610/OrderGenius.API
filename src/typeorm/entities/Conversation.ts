import { Column, Entity, Index } from 'typeorm';

// @Index('conversation_pkey', ['id'], { unique: true })
@Entity('conversation', { schema: 'public' })
export class Conversation {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('uuid', { name: 'user_c_id', nullable: true })
  userCId: string | null;

  @Column('date', { name: 'creation_time', nullable: true })
  creationTime: string | null;
}
