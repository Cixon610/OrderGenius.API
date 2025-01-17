import { Module } from '@nestjs/common';
import {
  LineController,
  MenuController,
  MenuItemController,
  MenuCategoryController,
  BusinessController,
  BusinessUserController,
  FileController,
  BusinessUserAuthController,
  ChatController,
  OrderController,
  ModificationController,
  ShoppingCartController,
  ClientUserController,
  RecommandController,
} from './index';
import { ServicesModule } from 'src/core/services';
import { JwtModule } from '@nestjs/jwt';
import { SysConfigService } from 'src/infra/services';
import { InfraConfig } from 'src/infra/config';

const exportControllers = [
  LineController,
  MenuController,
  MenuItemController,
  MenuCategoryController,
  BusinessController,
  BusinessUserController,
  BusinessUserAuthController,
  FileController,
  ChatController,
  OrderController,
  ModificationController,
  ShoppingCartController,
  ClientUserController,
  RecommandController,
];
const infraConfig = new InfraConfig();
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: infraConfig.jwtSecret,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    ServicesModule,
  ],
  providers: [SysConfigService],
  controllers: exportControllers,
})
export class ApplicationModule {}
