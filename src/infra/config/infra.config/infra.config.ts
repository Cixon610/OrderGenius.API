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

  get saltRounds(): number {
    return Number(process.env.SALT_ROUNDS);
  }

  get jwtSecret(): string {
    return String(process.env.JWT_SECRET);
  }
}
