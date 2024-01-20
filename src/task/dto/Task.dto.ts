import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Task title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'Task descriptons' })
  text: string;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'deadline date' })
  deadline: Date;
}
