export class ConnectionAuthVo {
  public constructor(init?: Partial<ConnectionAuthVo>) {
    Object.assign(this, init);
  }

  jwtToken: string;
  userId: string;
  businessId: string;
  //未來有SSO機制再用sessionId
  //sessionId: string;
  timestamp: number;
  signature: string;
}
