import { Column, Entity, Index } from "typeorm";

@Index("message_pkey", ["id"], { unique: true })
@Entity("message", { schema: "public" })
export class Message {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "conversation_id", nullable: true })
  conversationId: string | null;

  @Column("text", { name: "message", nullable: true })
  message: string | null;

  @Column("integer", { name: "order_id", nullable: true })
  orderId: number | null;

  @Column("date", { name: "creation_time", nullable: true })
  creationTime: string | null;
}
