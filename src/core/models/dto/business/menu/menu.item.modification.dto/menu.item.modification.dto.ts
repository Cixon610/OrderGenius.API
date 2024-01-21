import { ApiProperty } from "@nestjs/swagger";
export class MenuItemModificationDto {
    @ApiProperty({ example: 0, description: 'id' })
    id: number;

    @ApiProperty({ example: 'name', description: 'name' })
    name: string;

    @ApiProperty({ example: {'key': 'price'}, description: 'options' })
    options?: Map<string, number>;
    
    @ApiProperty({ example: 1, description: 'max_choices' })
    max_choices: number;
}