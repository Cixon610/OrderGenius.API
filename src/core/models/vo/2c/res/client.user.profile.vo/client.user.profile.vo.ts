import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { LineAccount } from "src/infra/typeorm";

export class ClientUserProfileVo extends PartialType(LineAccount) {
    public constructor(init?: ClientUserProfileVo) {
      super(init);
      Object.assign(this, init);
    }
    @Exclude()
    id: string;
    
    @Exclude()
    businessUserId?: string | null;
    @Exclude()
    createdAt?: Date | null;
    @Exclude()
    updatedAt?: Date | null;
  }
