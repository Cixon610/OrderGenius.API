import { randomUUID } from 'crypto';
export class ModificationDto {
  public constructor(init?: Partial<ModificationDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  businessId!: string;
  name!: string;
  options?: Record<string, number>;
  maxChoices?: number;
  minChoices?: number;
  updateUserId?: string;
}
