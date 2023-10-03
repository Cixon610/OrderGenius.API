import { Module } from '@nestjs/common';
import { SysConfigService } from './services/config/sys.config.service';
import { InfraConfig, ThirdPartyConfig } from './config';

@Module({
  imports: [InfraConfig, ThirdPartyConfig],
  providers: [SysConfigService],
  exports: [SysConfigService],
})
export class InfraModule {}
