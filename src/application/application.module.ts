import { Module } from '@nestjs/common';
import {
  LineController,
  MenuController,
  MenuItemController,
  MenuCategoryController,
  BusinessController,
} from './index';
import { ServicesModule } from 'src/core/services';

@Module({
  imports: [ServicesModule],
  controllers: [
    LineController,
    MenuController,
    MenuItemController,
    MenuCategoryController,
    BusinessController,
  ],
})
export class ApplicationModule {}
