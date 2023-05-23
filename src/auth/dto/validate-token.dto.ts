import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class IsValidDTO {
  isValid: boolean;
}
