import {
  JwtStrategy,
  LocalStrategy,
  LineService,
  MenuService,
  FileService,
  OrderService,
  OpenaiAgentService,
  OpenaiLlmService,
  MenuItemService,
  BusinessService,
  ClientUserService,
  MenuCategoryService,
  BusinessUserService,
  ModificationService,
  ShoppingCartService,
  MenuPromptService,
  RecommandService,
  ChatService,
  ToolCallsService,
} from './index';
import { Module } from '@nestjs/common';
import * as typeorm from 'src/infra/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GithubService,
  RedisService,
  SysConfigService,
} from 'src/infra/services';
import { JwtModule } from '@nestjs/jwt';
import { InfraConfig } from 'src/infra/config';
import { LlmFactory } from './factory/llm.factory';
import { OrderNotifyGateway } from '../gateways/order-notify/order-notify.gateway';

const entities = Object.values(typeorm);
const exportServices = [
  JwtStrategy,
  LocalStrategy,
  LineService,
  MenuService,
  FileService,
  OrderService,
  MenuItemService,
  BusinessService,
  ClientUserService,
  MenuCategoryService,
  BusinessUserService,
  ModificationService,
  ShoppingCartService,
  RedisService,
  MenuPromptService,
  OpenaiAgentService,
  OpenaiLlmService,
  RecommandService,
  GithubService,
  SysConfigService,
  ChatService,
  ToolCallsService,
  LlmFactory,
  OrderNotifyGateway
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
    TypeOrmModule.forFeature([...entities]),
  ],
  providers: [...exportServices],
  exports: exportServices,
})
export class ServicesModule {}
