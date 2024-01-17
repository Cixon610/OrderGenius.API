import { randomUUID } from 'crypto';
export class ModificationDto {
  public constructor(init?: Partial<ModificationDto>) {
    Object.assign(this, init);
  }
  
  id: string = randomUUID();
  businessId!: string;
  name!: string;
  content?: object;
  updateUserId?: string;
}