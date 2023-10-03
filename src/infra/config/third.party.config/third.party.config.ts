export class ThirdPartyConfig {
  get lineChannelId(): string {
    return process.env.LINE_CHANNEL_ID;
  }

  get lineChannelSecret(): string {
    return process.env.LINE_CHANNEL_SECRET;
  }
}
