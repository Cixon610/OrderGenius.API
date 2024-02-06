export class PromptModificationVo {
  public constructor(init?: PromptModificationVo) {
    Object.assign(this, init);
  }
  name: string;
  options: Record<string, number>;
  maxChoices: number;
}
