import { randomUUID } from 'crypto';

export class BusinessDto {
  public constructor(init?: Partial<BusinessDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  name: string;
  placeId: string | null;
  address: string | null;
  phone: string | null;
}
