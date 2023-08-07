import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LineAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  line_id: string;

  @Column()
  display_name: string;

  @Column()
  picture_url: string;

  @Column({ nullable: true })
  status_message: string;

  @Column()
  user_id: string;

  @Column({ type: 'timestamp' })
  creation_time: Date;

  @Column({ type: 'timestamp' })
  update_time: Date;
}
