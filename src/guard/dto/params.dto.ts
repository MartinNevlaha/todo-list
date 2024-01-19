import { IsNotEmpty, IsUUID } from 'class-validator';

export class ParamsDto {
  @IsNotEmpty()
  @IsUUID()
  todoId: string;
}
