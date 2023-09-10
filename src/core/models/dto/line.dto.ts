import { IsNotEmpty } from 'class-validator';

export class CreateLineAccountDto {
  @IsNotEmpty()
  lineId: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  pictureUrl: string;

  statusMessage: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  creationTime: Date;

  @IsNotEmpty()
  updateTime: Date;
}
