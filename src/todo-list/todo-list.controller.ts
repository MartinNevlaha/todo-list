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
import { AssignOrUnassignRes } from './interface/assignOrUnassign.interface';
import { PermissionGuard } from 'src/guard/permission.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Todo lists routes')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@Controller('todo-lists')
export class TodoListController {
  constructor(private todolistService: TodoListService) {}

  @ApiOperation({ summary: 'create todo list' })
  @ApiCreatedResponse({ description: 'Todo list created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Get all todo lists' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  getAllTodoLists(): Promise<TodoList[]> {
    return this.todolistService.getAllTodoLists();
  }

  @ApiOperation({ summary: 'Get all todo lists by user' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('jwt-token')
  @Get('/user')
  @UseGuards(AuthGuard())
  getAllTodoListsByUser(@GetUser() user: User): Promise<TodoList[]> {
    return this.todolistService.getAllTodoLists(user);
  }

  @ApiOperation({ summary: 'Get toto list by id' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Todo list not found' })
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @Get('/:todoId')
  getTodoListById(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
  ): Promise<TodoList> {
    return this.todolistService.getTodoListById(todoId);
  }

  @ApiOperation({
    summary: 'Update title of todo list, protected by permission guard',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Todo list not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth('jwt-token')
  @Patch('/:todoId')
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
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiBearerAuth('jwt-token')
  @Patch('/:todoId/assign-user')
  @UseGuards(AuthGuard())
  assignUserToTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @GetUser() user: User,
  ): Promise<AssignOrUnassignRes> {
    return this.todolistService.assignOrUnassingUser(todoId, user);
  }

  @ApiOperation({ summary: 'unassign user from todo list' })
  @ApiOkResponse({ description: 'User was unassigned from todo list' })
  @ApiNotFoundResponse({ description: 'Todo list or user not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiBearerAuth('jwt-token')
  @Patch('/:todoId/unassign-user')
  @UseGuards(AuthGuard())
  unassignUserToTodoList(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @GetUser() user: User,
  ): Promise<AssignOrUnassignRes> {
    return this.todolistService.assignOrUnassingUser(todoId, user, true);
  }

  @ApiOperation({
    summary: 'Delete todo list by id, protected by permission guard',
  })
  @ApiOkResponse({ description: 'todo list deleted' })
  @ApiNotFoundResponse({ description: 'todo list not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
