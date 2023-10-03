import { Module } from '@nestjs/common';
import {
  MenuCategoryService,
  LineService,
  MenuService,
  MenuItemService,
} from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from 'src/infra/typeorm';
import { SysConfigService } from 'src/infra/services';

const entities = Object.values(typeorm);
@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [LineService, MenuService, MenuCategoryService, MenuItemService, SysConfigService],
  exports: [LineService, MenuService, MenuCategoryService, MenuItemService],
})
export class ServicesModule {}
