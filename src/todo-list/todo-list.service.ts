import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoList } from './todo-list.entity';
import { Repository } from 'typeorm';
import { TodoListDto } from './dto/createTodoList.dto';
import { User } from 'src/user/user.entity';
import { AssignOrUnassignRes } from './interface/assignOrUnassign.interface';

@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
  ) {}

  async getAllTodoLists(user?: User): Promise<TodoList[]> {
    let query: object = {};
    if (user) {
      query = {
        relations: ['users'],
        where: {
          users: {
            id: user.id,
          },
        },
      };
    }
    return this.todoListRepository.find(query);
  }
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

  async assignOrUnassingUser(
    id: string,
    loggedUser: User,
    remove: boolean = false,
  ): Promise<AssignOrUnassignRes> {
    const todo = await this.todoListRepository.findOne({
      where: { id: id },
      relations: ['users'],
    });

    if (!todo) {
      throw new NotFoundException('Todo list not found');
    }
    if (!loggedUser) {
      throw new NotFoundException('User not found');
    }
    if (remove) {
      todo.users = todo.users.filter((user) => user.id !== loggedUser.id);
    } else {
      todo.users = [...todo.users, loggedUser];
    }
    try {
      await this.todoListRepository.save(todo);
      return {
        message: 'success',
        userId: loggedUser.id,
        todoId: todo.id,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
