import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './core/services/services.module';
import { ApplicationModule } from './application/application.module';
import * as typeorm from './infra/typeorm';

const entities = Object.values(typeorm);
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL'),
        entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ServicesModule,
    ApplicationModule,
  ],
})
export class AppModule {}
