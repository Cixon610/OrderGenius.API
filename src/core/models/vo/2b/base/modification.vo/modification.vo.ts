import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class ModificationVo {
  public constructor(init?: Partial<ModificationVo>) {
    Object.assign(this, init);
  }

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'name', description: 'name' })
  name!: string;

  @IsOptional()
  @ApiProperty({ example: 'content', description: 'content' })
  content?: object;
}
