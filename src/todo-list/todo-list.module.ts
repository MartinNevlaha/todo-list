import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList } from './todo-list.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList]), AuthModule, UserModule],
  providers: [TodoListService],
  controllers: [TodoListController],
  exports: [TodoListService],
})
export class TodoListModule {}
