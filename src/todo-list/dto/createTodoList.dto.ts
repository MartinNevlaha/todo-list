import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TodoListDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Todo list title' })
  title: string;
}
