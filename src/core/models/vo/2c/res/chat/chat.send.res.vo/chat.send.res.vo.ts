import { ApiProperty } from "@nestjs/swagger";

export class ChatSendResVo {
    public constructor(init?: ChatSendResVo) {
      Object.assign(this, init);
    }
    @ApiProperty()
    message: string;
}
