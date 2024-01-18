import { IsNotEmpty, IsString } from 'class-validator';

export class TodoListDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
