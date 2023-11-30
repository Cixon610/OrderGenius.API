import { Module } from '@nestjs/common';
import { SysConfigService } from 'src/infra/services';
import { JwtMiddleware } from './index';
import { JwtModule } from '@nestjs/jwt';

const exportServices = [
  JwtMiddleware
];
@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [...exportServices, SysConfigService],
  exports: exportServices,
})
export class MiddlewareModule {}
