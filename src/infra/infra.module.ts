import { Module } from '@nestjs/common';
import { SysConfigService } from './services/config/sys.config.service';
import { InfraConfig, ThirdPartyConfig } from './config';
import { GithubService, RedisService } from './services';

const exportServices = [SysConfigService, RedisService, GithubService];

@Module({
  imports: [InfraConfig, ThirdPartyConfig],
  providers: [...exportServices],
  exports: [...exportServices],
})
export class InfraModule {}
