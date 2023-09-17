import { ApiProperty } from '@nestjs/swagger';

export class MenuResVo {
  public constructor(init?: Partial<MenuResVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'businessId', description: 'businessId' })
  businessId: string;

  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: 'description', description: 'description' })
  description: string;
}
