import { randomUUID } from "crypto";

export class BusinessUserDto {
    public constructor(init?: Partial<BusinessUserDto>) {
      Object.assign(this, init);
    }
  
    id: string = randomUUID();
    businessId: string;
    userName: string;
    account: string;
    password: string;
    email: string;
    phone: string | null;
    address: string | null;
}
