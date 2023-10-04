import { ApiProperty } from '@nestjs/swagger';

export class BusinessResVo {
  public constructor(init?: Partial<BusinessResVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'id',
  })
  id: string;

  @ApiProperty({ example: '五十嵐', description: 'name' })
  name: string | null;

  @ApiProperty({ example: 'test', description: 'placeId' })
  placeId: string | null;

  @ApiProperty({
    example: '235新北市中和區中山路三段113號',
    description: 'address',
  })
  address: string | null;

  @ApiProperty({ example: '0222265930', description: 'phone' })
  phone: string | null;
}
