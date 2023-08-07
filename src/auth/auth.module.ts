import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineAccount } from 'src/typeorm';
import { LineController } from './controllers/line/line.controller';
import { LineService } from './services/line/line.service';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [TypeOrmModule.forFeature([LineAccount])],
})
export class AuthModule {}
