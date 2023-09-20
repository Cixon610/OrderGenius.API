import { ApiProperty } from '@nestjs/swagger';

export class MenuUpdateReqVo {
  @ApiProperty({
    example: '1c9be2bb4-57be-11ee-8c99-0242ac120002',
    description: 'Id',
  })
  id: string;

  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({ example: 'updateMenuName', description: 'name' })
  name: string;

  @ApiProperty({ example: 'updateMenuDescription', description: 'description' })
  description: string;
}
