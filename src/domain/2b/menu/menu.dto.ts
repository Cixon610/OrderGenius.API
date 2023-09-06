import { ApiProperty } from '@nestjs/swagger';

export class MenuDto {
  @ApiProperty({ example: '1', description: 'id' })
  id: string;

  @ApiProperty({ example: '1', description: 'name' })
  businessId: string;

  @ApiProperty({ example: '1', description: 'price' })
  content: object;

  @ApiProperty({ example: '1', description: 'creation_time' })
  creationTime: Date;

  @ApiProperty({ example: '1', description: 'update_time' })
  updateTime: Date;

  @ApiProperty({ example: '1', description: 'update_user_id' })
  updateUserId: string;
}
