import { IsString, IsNotEmpty } from 'class-validator';

export class CheckinDto {
  @IsString()
  @IsNotEmpty()
  ticketCode: string;
}
