import { Module } from '@nestjs/common';
import { LineController } from './controllers/line/line.controller';

@Module({
  controllers: [LineController],
  providers: [],
})
export class AuthModule {}
