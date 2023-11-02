export class LineProfileDto {
  public constructor(init?: Partial<LineProfileDto>) {
    Object.assign(this, init);
  }
  
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  businessId: string;
}
