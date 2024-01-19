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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Todo lists routes')
@Controller('todo-lists')
export class TodoListController {
  constructor(private todolistService: TodoListService) {}

  @ApiOperation({ summary: 'create todo list' })
  @ApiCreatedResponse({ description: 'Todo list created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: TodoListDto })
  @Post()
  @UseGuards(AuthGuard())
  createTodoList(
    @Body() createTodoListDto: TodoListDto,
    @GetUser() user: User,
  ): Promise<TodoList> {
    return this.todolistService.createTodoList(createTodoListDto, user);
  }

  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiOperation({ summary: 'Get toto list by id' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Todo list not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get('/:todoId')
  getTodoListById(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
  ): Promise<TodoList> {
    return this.todolistService.getTodoListById(todoId);
  }

  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiOperation({ summary: 'Update title of todo list' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Todo list not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Patch('/:todoId')
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: TodoListDto })
  @UseGuards(AuthGuard(), PermissionGuard)
  updateTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() updateTodoListDto: TodoListDto,
  ): Promise<TodoList> {
    return this.todolistService.updateTodoList(todoId, updateTodoListDto);
  }

  @ApiOperation({ summary: 'assign user to todo list' })
  @ApiOkResponse({ description: 'User was assigned to todo list' })
  @ApiNotFoundResponse({ description: 'Todo or user list not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: AddUserToTodoDto })
  @Patch('/:todoId/assign-user')
  @UseGuards(AuthGuard())
  assignUserToTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() addUserToTodoDto: AddUserToTodoDto,
  ): Promise<AssignOrUnassignRes> {
    return this.todolistService.assignOrUnassingUser(todoId, addUserToTodoDto);
  }

  @ApiOperation({ summary: 'unassign user from todo list' })
  @ApiOkResponse({ description: 'User was unassigned from todo list' })
  @ApiNotFoundResponse({ description: 'Todo list or user not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: AddUserToTodoDto })
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

  @ApiOperation({ summary: 'Delete todo list by id' })
  @ApiOkResponse({ description: 'todo list deleted' })
  @ApiNotFoundResponse({ description: 'todo list not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiBearerAuth('jwt-token')
  @Delete('/:todoId')
  @UseGuards(AuthGuard(), PermissionGuard)
  deleteTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
  ): Promise<{ message: string }> {
    return this.todolistService.deleteTodoList(todoId);
  }
}
