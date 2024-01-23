import {
  LineService,
  MenuService,
  JwtStrategy,
  FileService,
  OrderService,
  OpenaiService,
  LocalStrategy,
  MenuItemService,
  BusinessService,
  ClientUserService,
  MenuCategoryService,
  BusinessUserService,
  ModificationService,
  ShoppingCartService,
} from './index';
import { Module } from '@nestjs/common';
import * as typeorm from 'src/infra/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService, SysConfigService } from 'src/infra/services';
import { JwtModule } from '@nestjs/jwt';
import { InfraConfig } from 'src/infra/config';

const entities = Object.values(typeorm);
const exportServices = [
  LineService,
  MenuService,
  JwtStrategy,
  FileService,
  OrderService,
  OpenaiService,
  LocalStrategy,
  MenuItemService,
  BusinessService,
  ClientUserService,
  MenuCategoryService,
  BusinessUserService,
  ModificationService,
  ShoppingCartService,
  RedisService,
];
const infraConfig = new InfraConfig();
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: infraConfig.jwtSecret,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    TypeOrmModule.forFeature([...entities]),
  ],
  providers: [...exportServices, SysConfigService],
  exports: exportServices,
})
export class ServicesModule {}
