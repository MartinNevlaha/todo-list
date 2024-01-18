import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoList } from './todo-list.entity';
import { Repository } from 'typeorm';
import { TodoListDto } from './dto/createTodoList.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AddUserToTodoDto } from './dto/addUserToTodo.dto';

@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
    private userService: UserService,
  ) {}

  async createTodoList(
    createTodoListDto: TodoListDto,
    user: User,
  ): Promise<TodoList> {
    const todoList = this.todoListRepository.create({
      ...createTodoListDto,
      users: [user],
    });
    return await this.todoListRepository.save(todoList);
  }

  async getTodoListById(id: string): Promise<TodoList> {
    const todo = await this.todoListRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!todo) {
      throw new NotFoundException('Todo list not found');
    }
    return todo;
  }

  async assignUserToTodoList(
    id: string,
    addUserToTodoDto: AddUserToTodoDto,
    remove: boolean = false,
  ): Promise<TodoList> {
    const { userId } = addUserToTodoDto;
    const todo = await this.todoListRepository.findOne({
      where: { id: id },
      relations: ['users'],
    });

    const user = await this.userService.findById(userId);

    if (!todo) {
      throw new NotFoundException('Todo list not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (remove) {
      todo.users = todo.users.filter((user) => user.id !== userId);
    } else {
      todo.users = [...todo.users, user];
    }
    return await this.todoListRepository.save(todo);
  }

  async updateTodoList(
    id: string,
    createTodoListDto: TodoListDto,
  ): Promise<TodoList> {
    const { title } = createTodoListDto;
    const todo = await this.getTodoListById(id);

    if (!todo) throw new NotFoundException();
    todo.title = title;
    return await this.todoListRepository.save(todo);
  }

  async deleteTodoList(id: string): Promise<{ message: string }> {
    const result = await this.todoListRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: 'success',
    };
  }
}
