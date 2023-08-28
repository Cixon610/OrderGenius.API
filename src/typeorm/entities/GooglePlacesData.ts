import { Column, Entity, Index } from "typeorm";

@Index("google_places_data_pkey", ["id"], { unique: true })
@Entity("google_places_data", { schema: "public" })
export class GooglePlacesData {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "business_id", nullable: true })
  businessId: string | null;

  @Column("json", { name: "data", nullable: true })
  data: object | null;

  @Column("date", { name: "creation_time", nullable: true })
  creationTime: string | null;

  @Column("date", { name: "update_time", nullable: true })
  updateTime: string | null;
}
