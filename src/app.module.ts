import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './core/services/services.module';
import { AuthorizationModule } from './core/services/authorization.module';
import { ApplicationModule } from './application/application.module';
import { InfraModule } from './infra/infra.module';
import * as typeorm from './infra/typeorm';
import { InfraConfig } from './infra/config';
import { join } from 'path';
import { RedisModule } from '@songkeys/nestjs-redis';

const entities = Object.values(typeorm);
const infraConfig = new InfraConfig();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: infraConfig.dbUrl,
        entities,
        synchronize: true,
      }),
    }),
    ServicesModule,
    ApplicationModule,
    InfraModule,
    AuthorizationModule.register({
      global: true,
      modelPath: join(__dirname, '../casbin/model.conf'),
      policyAdapter: join(__dirname, '../casbin/policy.csv'),
    }),
    RedisModule.forRoot({
      config: {
        host: infraConfig.redisHost,
        port: infraConfig.redisPort,
        username: infraConfig.redisUserName,
        password: infraConfig.redisPassword,
      },
    }),
  ],
})
export class AppModule {}
