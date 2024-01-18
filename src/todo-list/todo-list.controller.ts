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

  @Get('/:id')
  getTodoListById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<TodoList> {
    return this.todolistService.getTodoListById(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  updateTodoList(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTodoListDto: TodoListDto,
  ): Promise<TodoList> {
    return this.todolistService.updateTodoList(id, updateTodoListDto);
  }

  @Patch('/:id/assign-user')
  @UseGuards(AuthGuard())
  assignUserToTodoList(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() addUserToTodoDto: AddUserToTodoDto,
  ): Promise<TodoList> {
    return this.todolistService.assignUserToTodoList(id, addUserToTodoDto);
  }

  @Patch('/:id/unassign-user')
  @UseGuards(AuthGuard())
  unassignUserToTodoList(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() addUserToTodoDto: AddUserToTodoDto,
  ): Promise<TodoList> {
    return this.todolistService.assignUserToTodoList(
      id,
      addUserToTodoDto,
      true,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteTodoList(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    return this.todolistService.deleteTodoList(id);
  }
}
