import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TodoListModule } from './todo-list/todo-list.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [UserModule, AuthModule, TodoListModule, DatabaseModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
