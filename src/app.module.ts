import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { JwtMiddleware, LoggerMiddleware } from './core/middlewares';
import { JwtModule } from '@nestjs/jwt';
import { GatewaysModule } from './core/gateways/gateways.module';

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
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: infraConfig.jwtSecret,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    AuthorizationModule.register({
      global: true,
      modelPath: join(__dirname, '../casbin/model.conf'),
      policyAdapter: join(__dirname, '../casbin/policy.csv'),
    }),
    RedisModule.forRoot({
      config: {
        url: infraConfig.redisUrl,
      },
    }),
    ServicesModule,
    ApplicationModule,
    InfraModule,
    GatewaysModule,
  ],
  providers: [JwtMiddleware],
  exports: [JwtMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*'); // apply the middleware to all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
