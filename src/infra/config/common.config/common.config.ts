export class CommonConfig {
  get environment(): string {
    return process.env.ENVIRONMENT;
  }

  get localPromptPath(): string {
    return process.env.LOCAL_PROMPT_PATH;
  }

  get defaultBzId(): string {
    return '00000000-0000-0000-0000-000000000000';
  }
}
