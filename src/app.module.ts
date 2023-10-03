import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './core/services/services.module';
import { ApplicationModule } from './application/application.module';
import { InfraModule } from './infra/infra.module';
import * as typeorm from './infra/typeorm';
import { InfraConfig } from './infra/config';

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
  ],
})
export class AppModule {}
