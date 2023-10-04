import { Module } from '@nestjs/common';
import {
  MenuCategoryService,
  LineService,
  MenuService,
  MenuItemService,
  BusinessService,
} from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from 'src/infra/typeorm';
import { SysConfigService } from 'src/infra/services';

const entities = Object.values(typeorm);
@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [SysConfigService, LineService, MenuService, MenuCategoryService, MenuItemService, BusinessService],
  exports: [LineService, MenuService, MenuCategoryService, MenuItemService, BusinessService],
})
export class ServicesModule {}
