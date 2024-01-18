import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './taks.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TodoListModule } from 'src/todo-list/todo-list.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule, TodoListModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
