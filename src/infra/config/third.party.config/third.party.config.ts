export class ThirdPartyConfig {
  get lineChannelId2B(): string {
    return process.env.LINE_CHANNEL_ID_2B;
  }

  get lineChannelSecret2B(): string {
    return process.env.LINE_CHANNEL_SECRET_2B;
  }

  get lineChannelId2C(): string {
    return process.env.LINE_CHANNEL_ID_2C;
  }

  get lineChannelSecret2C(): string {
    return process.env.LINE_CHANNEL_SECRET_2C;
  }

  get opeanaiApiKey(): string {
    return process.env.OPENAI_API_KEY;
  }

  get openaiModelId(): string {
    return process.env.OPENAI_MODEL_ID;
  }
}
