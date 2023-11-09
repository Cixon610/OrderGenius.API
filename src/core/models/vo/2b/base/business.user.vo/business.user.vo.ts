import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class BusinessUserVo {
  public constructor(init?: Partial<BusinessUserVo>) {
    Object.assign(this, init);
  }
  
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId!: string;

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
