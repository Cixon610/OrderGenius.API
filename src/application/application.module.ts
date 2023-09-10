import { Module } from '@nestjs/common';
import { LineController, MenuController } from './Index';
import { ServicesModule } from 'src/core/services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [LineController, MenuController],
})
export class ApplicationModule {}
