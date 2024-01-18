import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    const todoId: string = req.params.todoId;
    let permittedTodoList: string[] = [];

    if (typeof todoId !== 'string') {
      throw new BadRequestException();
    }
    if (user && user.todoLists) {
      permittedTodoList = user.todoLists.map((todo) => todo.id);
    }

    return permittedTodoList.includes(todoId);
  }
}
