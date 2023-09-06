import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './domain/2b/menu/menu.module';

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
    AuthModule,
    MenuModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
