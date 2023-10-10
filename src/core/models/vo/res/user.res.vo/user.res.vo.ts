import { ApiProperty } from "@nestjs/swagger";

export class UserResVo {
    public constructor(init?: Partial<UserResVo>) {
      Object.assign(this, init);
    }
  
    @ApiProperty({ example: 'id', description: 'id' })
    id: string;
    
    @ApiProperty({ example: 'businessId', description: 'businessId' })
    businessId: string;

    @ApiProperty({ example: 'userName', description: 'userName' })
    userName: string;
    
    @ApiProperty({ example: 'account', description: 'account' })
    account: string;
    
    @ApiProperty({ example: 'password', description: 'password' })
    password: string;
    
    @ApiProperty({ example: 'email', description: 'email' })
    email: string;
    
    @ApiProperty({ example: 'phone', description: 'phone' })
    phone: string | null;
    
    @ApiProperty({ example: 'address', description: 'address' })
    address: string | null;
}
