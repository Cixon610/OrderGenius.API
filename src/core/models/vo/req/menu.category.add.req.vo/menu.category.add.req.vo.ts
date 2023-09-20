import { ApiProperty } from '@nestjs/swagger';

export class MenuCategoryAddReqVo {
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({ example: 'MenuCategoryName01', description: 'businessId' })
  name: string;

  @ApiProperty({
    example: 'MenuCategoryDescription01',
    description: 'description',
  })
  description: string | null;

  @ApiProperty({
    example: 'https://pbs.twimg.com/media/FVIBWqVUcAEB_9X.jpg:large',
    description: 'pictureUrl',
  })
  pictureUrl: string | null;

  @ApiProperty({
    example: '["7e52f036-e1c9-43aa-8870-9076cd9d5e3a"]',
    description: 'menuItemIds',
  })
  menuItemIds: string[];
}
