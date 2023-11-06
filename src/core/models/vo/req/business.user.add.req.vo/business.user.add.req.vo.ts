import { ApiProperty } from '@nestjs/swagger';

export class BusinessUserAddReqVo {
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({
    example: 'userName',
    description: 'userName',
  })
  userName: string;

  @ApiProperty({
    example: 'account',
    description: 'account',
  })
  account: string;

  @ApiProperty({
    example: 'password',
    description: 'password',
  })
  password: string;

  @ApiProperty({
    example: 'email',
    description: 'email',
  })
  email: string;

  @ApiProperty({
    example: 'phone',
    description: 'phone',
  })
  phone: string | null;

  @ApiProperty({
    example: 'address',
    description: 'address',
  })
  address: string | null;
}
