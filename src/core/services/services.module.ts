import { Module } from '@nestjs/common';
import { LineService, MenuService } from './index';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeorm from '../../infra/typeorm';

const entities = Object.values(typeorm);
@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [LineService, MenuService],
  exports: [LineService, MenuService],
})
export class ServicesModule {}
