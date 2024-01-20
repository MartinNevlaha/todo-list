import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './taks.entity';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/Task.dto';
import { User } from 'src/user/user.entity';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { TaskStatus } from './dto/task-status.enum';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private todoListService: TodoListService,
  ) {}

  async createTask(
    todoId: string,
    createTaskDto: TaskDto,
    user: User,
  ): Promise<Task> {
    const todo = await this.todoListService.getTodoListById(todoId);

    if (!todo) throw new NotFoundException('Todo list not found');

    const task = this.taskRepository.create({
      ...createTaskDto,
      creator: user.email,
      status: TaskStatus.OPEN,
      todo,
    });

    return await this.taskRepository.save(task);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    todoId: string,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(id);
    const todo = await this.todoListService.getTodoListById(todoId);
    if (!task || !todo) {
      throw new NotFoundException();
    }
    task.status = status;
    return await this.taskRepository.save(task);
  }

  async updateTask(id: string, todoId: string, updateTaskDto: TaskDto) {
    const task = await this.getTaskById(id);
    const todo = await this.todoListService.getTodoListById(todoId);
    if (!task || !todo) {
      throw new NotFoundException();
    }

    task.text = updateTaskDto.text;
    task.title = updateTaskDto.title;
    task.deadline = updateTaskDto.deadline;
    return await this.taskRepository.save(task);
  }
}
