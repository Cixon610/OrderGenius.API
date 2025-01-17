import { Injectable } from '@nestjs/common';
import { CommonConfig, InfraConfig, ThirdPartyConfig } from 'src/infra/config';

@Injectable()
export class SysConfigService {
  get infra(): InfraConfig {
    return new InfraConfig();
  }

  get thirdParty(): ThirdPartyConfig {
    return new ThirdPartyConfig();
  }

  get common(): CommonConfig {
    return new CommonConfig();
  }
}
