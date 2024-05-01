import { ApiProperty } from "@nestjs/swagger";

export class ChatCreateResVo {
    public constructor(init?: ChatCreateResVo) {
      Object.assign(this, init);
    }
    @ApiProperty()
    businessId: string;

    @ApiProperty()
    assistantId?: string;
    
    @ApiProperty()
    threadId: string;
}
