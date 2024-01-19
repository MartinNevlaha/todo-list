import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserToTodoDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String, description: 'id for the user to be used' })
  userId: string;
}
