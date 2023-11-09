import { ApiProperty } from "@nestjs/swagger";

export class LoginResVo {
    public constructor(init?: Partial<LoginResVo>) {
      Object.assign(this, init);
    }

    @ApiProperty({ example: '7709e3c4-57bc-11ee-8c99-0242ac120002', description: 'businessId' })
    businessId: string;

    @ApiProperty({ example: 'U4af498062qweqweasdasfdg', description: 'token' })
    token: string;
}
