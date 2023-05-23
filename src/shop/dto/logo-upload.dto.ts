import { ApiProperty } from '@nestjs/swagger';

export class LogoUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
