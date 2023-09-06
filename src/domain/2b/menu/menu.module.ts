import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [TypeOrmModule.forFeature([Menu])],
})
export class MenuModule {}
