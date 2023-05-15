import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30, {
    message: 'password length must be between 8 and 30 characters',
  })
  password: string;
}
