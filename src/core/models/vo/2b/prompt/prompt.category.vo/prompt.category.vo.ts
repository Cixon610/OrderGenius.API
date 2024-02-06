import { PromptItemVo } from '../prompt.item.vo/prompt.item.vo';

export class PromptCategoryVo {
  constructor(init?: PromptCategoryVo) {
    Object.assign(this, init);
  }
  name: string;
  description: string;
  items: PromptItemVo[];
}
