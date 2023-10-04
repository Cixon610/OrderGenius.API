import { ApiProperty } from '@nestjs/swagger';

export class BusinessAddReqVo {
    @ApiProperty({ example: '五十嵐', description: 'name' })
    name: string | null;

    @ApiProperty({ example: '4fd6a9ee-62cb-11ee-8c99-0242ac120002', description: 'placeId' })
    placeId: string | null;
  
    @ApiProperty({ example: '235新北市中和區中山路三段113號', description: 'address' })
    address: string | null;
  
    @ApiProperty({ example: '0222265930', description: 'phone' })
    phone: string | null;
}
