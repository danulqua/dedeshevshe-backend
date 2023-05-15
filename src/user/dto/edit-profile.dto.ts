import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class EditProfileDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 30, {
    message: 'password length must be between 8 and 30 characters',
  })
  password?: string;
}
