export class InfraConfig {
  get clientUrl2B(): string {
    return process.env.CLIENT_URL_2B;
  }

  get clientUrl2C(): string {
    return process.env.CLIENT_URL_2C;
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

  get jwrExpire(): string {
    return String(process.env.JWT_EXPIRE);
  }

  get awsS3Region(): string {
    return String(process.env.AWS_S3_REGION);
  }

  get awsS3AcessKeyId(): string {
    return String(process.env.AWS_S3_ACESS_KEY_ID);
  }

  get awsS3SecretAcessKey(): string {
    return String(process.env.AWS_S3_SECRET_ACESS_KEY);
  }

  get awsS3BuketNameImg(): string {
    return String(process.env.AWS_S3_BUKET_NAME_IMG);
  }

  get redisUrl(): string {
    return String(process.env.REDIS_URL);
  }

  get redisExpire(): number {
    return Number(process.env.RESIS_EXPIRE);
  }
}
