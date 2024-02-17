import { ApiProperty } from '@nestjs/swagger';

export class UserProfileVo {
  public constructor(init?: Partial<UserProfileVo>) {
    Object.assign(this, init);
  }
  /// <summary>
  /// ClientUser or BusinessUser ID
  /// </summary>
  @ApiProperty({ example: 'b769f1f1-f172-4456-bfcf...' })
  userId: string;

  @ApiProperty({ example: 'UserName' })
  displayName: string;

  @ApiProperty({ example: 'https://profile.line-scdn.net/abcdefghijklmn' })
  pictureUrl: string;

  @ApiProperty({ example: '(pug)' })
  statusMessage: string;

  @ApiProperty({ example: '7709e3c4-57bc-11ee-8c99-0242ac120002' })
  businessId: string;
}
