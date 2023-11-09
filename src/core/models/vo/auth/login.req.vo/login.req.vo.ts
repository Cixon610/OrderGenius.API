import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginReqVo {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin', description: 'username' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin', description: 'password' })
  password: string;
}
