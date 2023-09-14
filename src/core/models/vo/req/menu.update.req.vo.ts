import { ApiProperty } from '@nestjs/swagger';

export class MenuUpdateReqVo {
  @ApiProperty({ example: '1', description: 'Id' })
  Id: string;

  @ApiProperty({ example: '1', description: 'businessId' })
  businessId: string;

  @ApiProperty({ example: '1', description: 'name' })
  name: string;

  @ApiProperty({ example: '1', description: 'description' })
  description: string;
}
