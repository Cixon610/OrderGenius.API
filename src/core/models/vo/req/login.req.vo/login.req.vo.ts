import { ApiProperty } from "@nestjs/swagger";

export class LoginReqVo {
    @ApiProperty({ example: 'admin', description: 'username' })
    username: string;
    @ApiProperty({ example: 'admin', description: 'password' })
    password: string;
}
