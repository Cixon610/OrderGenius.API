import { ApiProperty } from '@nestjs/swagger';

export class MenuItemUpdateReqVo {
  @ApiProperty({ example: '1', description: 'Id' })
  id: string;

  @ApiProperty({ example: 'MenuItemName', description: 'name' })
  name: string;

  @ApiProperty({ example: 'MenuItemDescription', description: 'description' })
  description: string | null;

  @ApiProperty({ example: '200', description: 'price' })
  price: number;

  @ApiProperty({ example: '["property02":"02"]', description: 'modification' })
  modification: object | null;

  @ApiProperty({ example: 'updateNote', description: 'note' })
  note: string | null;

  @ApiProperty({ example: '1', description: 'enable' })
  enable: boolean;

  @ApiProperty({
    example:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXXvEho1fs41b6aEIfbg-gnX9vsOF0m6CzSiK-kREDYdlW7ZyBTJdab_w0GjirnXsrYcQ&usqp=CAU',
    description: 'pictureUrl',
  })
  pictureUrl: string | null;
}
