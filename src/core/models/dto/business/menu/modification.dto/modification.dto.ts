import { randomUUID } from 'crypto';
export class ModificationDto {
  public constructor(init?: Partial<ModificationDto>) {
    Object.assign(this, init);
  }
  
  id: string = randomUUID();
  businessId!: string;
  name!: string;
  options?: Map<string, number>;
  maxChoices?: number;
  updateUserId?: string;
}