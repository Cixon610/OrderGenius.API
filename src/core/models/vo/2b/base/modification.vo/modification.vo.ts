import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  isArray,
} from 'class-validator';
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
  @IsArray()
  @ApiProperty({
    example: '[{"option1":0,"option2":1 }]',
    description: 'options',
  })
  options?: Record<string, number>;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '1', description: 'maxChoices' })
  maxChoices?: number;
}
