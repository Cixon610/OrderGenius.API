import { PromptModificationVo } from '../prompt.modification.vo/prompt.modification.vo';

export class PromptItemVo {
  public constructor(init?: PromptItemVo) {
    Object.assign(this, init);
  }
  id: string;
  name: string;
  description: string;
  price: number;
  note: string;
  enable: boolean;
  promoted: boolean;
  modifications: PromptModificationVo[];
}
