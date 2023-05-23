import { IsString } from 'class-validator';

export class ReportOptionDTO {
  @IsString()
  option: ReportOption;
}

export enum ReportOption {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
