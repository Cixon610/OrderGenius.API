import { IsNotEmpty } from 'class-validator';

export class CreateLineAccountDto {
  @IsNotEmpty()
  line_id: string;

  @IsNotEmpty()
  display_name: string;

  @IsNotEmpty()
  picture_url: string;

  status_message: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  creation_time: Date;

  @IsNotEmpty()
  update_time: Date;
}
