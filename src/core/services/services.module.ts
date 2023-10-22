import { Module } from '@nestjs/common';
import {
  MenuCategoryService,
  LineService,
  MenuService,
  MenuItemService,
  BusinessService,
  UserService,
  LocalStrategy,
  FileService,
} from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from 'src/infra/typeorm';
import { SysConfigService } from 'src/infra/services';

const entities = Object.values(typeorm);
const exportServices = [
  LineService,
  MenuService,
  MenuCategoryService,
  MenuItemService,
  BusinessService,
  UserService,
  LocalStrategy,
  FileService,
];
@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [...exportServices, SysConfigService],
  exports: exportServices,
})
export class ServicesModule {}
