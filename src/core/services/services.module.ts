import { Module } from '@nestjs/common';
import { MenuCategoryService, LineService, MenuService, MenuItemService } from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from 'src/infra/typeorm';

const entities = Object.values(typeorm);
@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [LineService, MenuService, MenuCategoryService, MenuItemService],
  exports: [LineService, MenuService, MenuCategoryService, MenuItemService],
})
export class ServicesModule {}
