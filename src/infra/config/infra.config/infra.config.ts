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

  get awsS3Region(): string {
    return String(process.env.AWS_S3_REGION);
  }

  get awsS3AcessKeyId(): string {
    return String(process.env.AWS_S3_ACESS_KEY_ID);
  }

  get AwsS3SecretAcessKey(): string {
    return String(process.env.AWS_S3_SECRET_ACESS_KEY);
  }

  get AwsS3BuketNameImg(): string {
    return String(process.env.AWS_S3_BUKET_NAME_IMG);
  }
}
