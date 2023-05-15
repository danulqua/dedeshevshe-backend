import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30, {
    message: 'password length must be between 8 and 30 characters',
  })
  password: string;
}
