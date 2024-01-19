import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTask.dto';
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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Tasks routes')
@Controller('tasks')
@UseGuards(AuthGuard(), PermissionGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'create task' })
  @ApiCreatedResponse({ description: 'task created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: CreateTaskDto })
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @Post('/todo/:todoId')
  createTask(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(todoId, createTaskDto, user);
  }

  @ApiOperation({ summary: 'update task status' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Task or todo list not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBearerAuth('jwt-token')
  @ApiParam({ name: 'todoId', description: 'Id of todo list' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @Patch('/:id/todo-list/:todoId/status')
  updateTaskStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body()
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto, todoId);
  }
}
