import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserToTodoDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
