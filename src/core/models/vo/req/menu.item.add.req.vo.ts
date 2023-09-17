import { ApiProperty } from "@nestjs/swagger";

export class MenuItemAddReqVo {
    @ApiProperty({ example: '1', description: 'businessId' })
    businessId: string;

    @ApiProperty({ example: '1', description: 'name' })
    name: string;

    @ApiProperty({ example: '1', description: 'description' })
    description: string | null;

    @ApiProperty({ example: '1', description: 'price' })
    price: number;

    @ApiProperty({ example: '1', description: 'modification' })
    modification: object | null;

    @ApiProperty({ example: '1', description: 'note' })
    note: string | null;

    @ApiProperty({ example: '1', description: 'enable' })
    enable: boolean;

    @ApiProperty({ example: '1', description: 'pictureUrl' })
    pictureUrl: string | null;
}
