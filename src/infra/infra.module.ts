import { Module } from '@nestjs/common';
import { SysConfigService } from './services/config/sys.config.service';
import { InfraConfig, ThirdPartyConfig } from './config';
import { GithubService, RedisService } from './services';
import { LoggerService } from './services/logger/logger.service';

const exportServices = [
  SysConfigService,
  RedisService,
  GithubService,
  LoggerService,
];

@Module({
  imports: [InfraConfig, ThirdPartyConfig],
  providers: [...exportServices],
  exports: [...exportServices],
})
export class InfraModule {}
