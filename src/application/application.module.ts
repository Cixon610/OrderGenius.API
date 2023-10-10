import { Module } from '@nestjs/common';
import {
  LineController,
  MenuController,
  MenuItemController,
  MenuCategoryController,
  BusinessController,
  BusinessUserController,
} from './index';
import { ServicesModule } from 'src/core/services';

const exportControllers = [
  LineController,
  MenuController,
  MenuItemController,
  MenuCategoryController,
  BusinessController,
  BusinessUserController,
];
@Module({
  imports: [ServicesModule],
  controllers: exportControllers,
})
export class ApplicationModule {}
