import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/Task.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './taks.entity';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';
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

@ApiTags('Tasks routes')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@ApiBadRequestResponse({ description: 'Invalid input' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiBearerAuth('jwt-token')
@ApiParam({ name: 'todoId', description: 'Id of todo list' })
@Controller('tasks')
@UseGuards(AuthGuard(), PermissionGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'create task, protected by permission guard' })
  @ApiCreatedResponse({ description: 'task created' })
  @ApiBody({ type: TaskDto })
  @Post('/todo/:todoId')
  createTask(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() createTaskDto: TaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(todoId, createTaskDto, user);
  }

  @ApiOperation({
    summary: 'update task status, protected by permission guard',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Task or todo list not found' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiParam({ name: 'id', description: 'task id' })
  @Patch('/:id/todo-list/:todoId/status')
  updateTaskStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto, todoId);
  }

  @ApiOperation({ summary: 'update task, protected by permission guard' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Task or todo list not found' })
  @ApiParam({ name: 'id', description: 'task id' })
  @ApiBody({ type: TaskDto })
  @Put('/:id/todo-list/:todoId')
  updateTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() updateTaskDto: TaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, todoId, updateTaskDto);
  }

  @ApiOperation({ summary: 'delete task, protected by permission guard' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'task id' })
  @Delete('/:id/todo-list/:todoId')
  deleteTask(
    @Param('todoId') todoId: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.taskService.deleteTask(id, todoId);
  }
}
