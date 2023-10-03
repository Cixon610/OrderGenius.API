export class InfraConfig {
  get clientUrl(): string {
    return process.env.CLIENT_URL;
  }

  get dbUrl(): string {
    return process.env.DB_URL;
  }

  get dbType(): string {
    return process.env.DB_Type;
  }
}
