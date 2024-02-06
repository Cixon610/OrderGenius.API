import { PromptCategoryVo } from 'src/core/models';

export class PromptMenuVo {
  constructor(init?: PromptMenuVo) {
    Object.assign(this, init);
  }
  name: string;
  description: string;
  categories: PromptCategoryVo[];
}
