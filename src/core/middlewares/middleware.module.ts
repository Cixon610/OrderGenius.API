import { Module } from '@nestjs/common';
import { SysConfigService } from 'src/infra/services';
import { JwtMiddleware, LoggerMiddleware } from './index';
import { JwtModule } from '@nestjs/jwt';
import { InfraConfig } from 'src/infra/config';

const exportServices = [JwtMiddleware, LoggerMiddleware];
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
  ],
  providers: [...exportServices, SysConfigService],
  exports: exportServices,
})
export class MiddlewareModule {}
