import { ApiProperty } from "@nestjs/swagger";

type Options = Record<string, string>;
export class MenuItemModificationDto {
    @ApiProperty({ example: 0, description: 'id' })
    id: number;

    @ApiProperty({ example: 'name', description: 'name' })
    name: string;

    @ApiProperty({ example: true, description: 'pricing' })
    pricing: boolean;

    @ApiProperty({ example: {'key': 'value'}, description: 'options' })
    options?: Options;
    
    @ApiProperty({ example: 1, description: 'max_choices' })
    max_choices: number;
}