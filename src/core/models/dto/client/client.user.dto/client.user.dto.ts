import { randomUUID } from "crypto";

export class ClientUserDto {
  public constructor(init?: Partial<ClientUserDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  userName: string;
  account: string;
  password: string;
  email: string;
  phone: string | null;
  address: string | null;
}
