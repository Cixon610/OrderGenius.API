import { ApiProperty } from '@nestjs/swagger';

export class MenuItemAddReqVo {
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({ example: 'MenuItemName', description: 'name' })
  name: string;

  @ApiProperty({ example: 'MenuItemDescription', description: 'description' })
  description: string | null;

  @ApiProperty({ example: '100', description: 'price' })
  price: number;

  @ApiProperty({ example: '["Property01":"01"]', description: 'modification' })
  modification: object | null;

  @ApiProperty({ example: 'note', description: 'note' })
  note: string | null;

  @ApiProperty({ example: true, description: 'enable' })
  enable: boolean;

  @ApiProperty({ example: true, description: 'promoted' })
  promoted: boolean;

  @ApiProperty({
    example:
      'https://img.meepshop.com/r1RTAjt-AGmW_gdd6v1PhZwRem_RN192sA7zUMA-ajU/w:960/Z3M6Ly9pbWcubWVlcGNsb3VkLmNvbS9tZWVwc2hvcC9kMzljODBiYi1lNzQxLTQyMjYtYWNiZS1kOTc1ODVmMDVlMWQvZmlsZXMvNjhlYTM2ZjEtYWQwMS00MzZhLTg2YjQtMDk2NjljM2QyMGFiLmpwZw',
    description: 'pictureUrl',
  })
  pictureUrl: string | null;
}
