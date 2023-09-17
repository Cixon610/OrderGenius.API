import { Module } from '@nestjs/common';
import { LineController, MenuController, MenuItemController } from './index';
import { ServicesModule } from 'src/core/services';

@Module({
  imports: [ServicesModule],
  controllers: [LineController, MenuController, MenuItemController],
})
export class ApplicationModule {}
