import { IsString } from 'class-validator';

export type ReportOption = 'week' | 'month' | 'year';

export class ReportOptionDTO {
  @IsString()
  option: ReportOption;
}
