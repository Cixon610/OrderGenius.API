import { randomUUID } from "crypto";

export class LineAccountDto {
    public constructor(init?: Partial<LineAccountDto>) {
      Object.assign(this, init);
    }
  
    id: string = randomUUID();
    lineId: string;
    businessUserId: string | null;
    displayName: string;
    pictureUrl: string | null;
    statusMessage: string | null;
}
