import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BusinessVo {
  public constructor(init?: Partial<BusinessVo>) {
    Object.assign(this, init);
  }

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '五十嵐', description: 'name' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '4fd6a9ee-62cb-11ee-8c99-0242ac120002',
    description: 'placeId',
    nullable: true,
  })
  placeId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '235新北市中和區中山路三段113號',
    description: 'address',
    nullable: true,
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '0222265930', description: 'phone', nullable: true })
  phone?: string;
}
