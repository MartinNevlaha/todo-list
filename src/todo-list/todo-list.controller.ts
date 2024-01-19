import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoListDto } from './dto/createTodoList.dto';
import { TodoListService } from './todo-list.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { GetUser } from 'src/user/get-user.decorator';
import { TodoList } from './todo-list.entity';
import { AddUserToTodoDto } from './dto/addUserToTodo.dto';
import { AssignOrUnassignRes } from './interface/assignOrUnassign.interface';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('todo-lists')
export class TodoListController {
  constructor(private todolistService: TodoListService) {}

  @Post()
  @UseGuards(AuthGuard())
  createTodoList(
    @Body() createTodoListDto: TodoListDto,
    @GetUser() user: User,
  ): Promise<TodoList> {
    return this.todolistService.createTodoList(createTodoListDto, user);
  }

  @Get('/:todoId')
  getTodoListById(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
  ): Promise<TodoList> {
    return this.todolistService.getTodoListById(todoId);
  }

  @Patch('/:todoId')
  @UseGuards(AuthGuard(), PermissionGuard)
  updateTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() updateTodoListDto: TodoListDto,
  ): Promise<TodoList> {
    return this.todolistService.updateTodoList(todoId, updateTodoListDto);
  }

  @Patch('/:todoId/assign-user')
  @UseGuards(AuthGuard())
  assignUserToTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() addUserToTodoDto: AddUserToTodoDto,
  ): Promise<AssignOrUnassignRes> {
    return this.todolistService.assignOrUnassingUser(todoId, addUserToTodoDto);
  }

  @Patch('/:todoId/unassign-user')
  @UseGuards(AuthGuard())
  unassignUserToTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() addUserToTodoDto: AddUserToTodoDto,
  ): Promise<AssignOrUnassignRes> {
    return this.todolistService.assignOrUnassingUser(
      todoId,
      addUserToTodoDto,
      true,
    );
  }

  @Delete('/:todoId')
  @UseGuards(AuthGuard(), PermissionGuard)
  deleteTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
  ): Promise<{ message: string }> {
    return this.todolistService.deleteTodoList(todoId);
  }
}
