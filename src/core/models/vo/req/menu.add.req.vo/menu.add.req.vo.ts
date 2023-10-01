import { ApiProperty } from '@nestjs/swagger';

export class MenuAddReqVo {
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({ example: 'MenuName01', description: 'name' })
  name: string;

  @ApiProperty({ example: 'MenuDescription01', description: 'description' })
  description: string;

  @ApiProperty({
    example: 'https://pbs.twimg.com/media/FVIBWqVUcAEB_9X.jpg:large',
    description: 'pictureUrl',
  })
  pictureUrl: string | null;

  @ApiProperty({
    example: '["d5de5474-5a01-11ee-8c99-0242ac120002"]',
    description: 'categoryIds',
  })
  categoryIds: string[];
}