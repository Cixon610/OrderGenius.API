import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ClientUserVo {
  public constructor(init?: Partial<ClientUserVo>) {
    Object.assign(this, init);
  }

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'userName',
    description: 'userName',
  })
  userName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'account',
    description: 'account',
  })
  account!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'password',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'email',
    description: 'email',
  })
  email!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'phone',
    description: 'phone',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'address',
    description: 'address',
  })
  address?: string;
}
