import { IsNotEmpty } from 'class-validator';
import { randomUUID } from 'crypto';

export class LineAccountAddReqVo {
  public constructor(init?: Partial<LineAccountAddReqVo>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  @IsNotEmpty()
  lineId: string;
  businessUserId: string | null;
  @IsNotEmpty()
  displayName: string;
  pictureUrl: string | null;
  statusMessage: string | null;
  creationTime: Date | null;
  updateTime: Date | null;
}