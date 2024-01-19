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

@Controller('tasks')
@UseGuards(AuthGuard(), PermissionGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/todo/:todoId')
  createTask(
    @Param('todoId', new ParseUUIDPipe({ version: '4' })) todoId: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(todoId, createTaskDto, user);
  }

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
