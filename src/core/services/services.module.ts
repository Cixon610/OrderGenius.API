import { Module } from '@nestjs/common';
import {
  MenuCategoryService,
  LineService,
  MenuService,
  MenuItemService,
  BusinessService,
  BusinessUserService,
  LocalStrategy,
  FileService,
  JwtStrategy,
} from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from 'src/infra/typeorm';
import { SysConfigService } from 'src/infra/services';

const entities = Object.values(typeorm);
const exportServices = [
  BusinessUserService,
  LineService,
  MenuService,
  MenuCategoryService,
  MenuItemService,
  BusinessService,
  LocalStrategy,
  JwtStrategy,
  FileService,
];
@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [...exportServices, SysConfigService],
  exports: exportServices,
})
export class ServicesModule {}
