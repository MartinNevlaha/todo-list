import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { ParamsDto } from './dto/params.dto';
import { validate } from 'class-validator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    let permittedTodoList: string[] = [];
    const params = plainToClass(ParamsDto, req.params);
    const errors = await validate(params);

    const errorMsg = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    );

    if (errorMsg.length > 0) {
      throw new BadRequestException(errorMsg);
    }
    if (user && user.todoLists) {
      permittedTodoList = user.todoLists.map((todo) => todo.id);
    }

    return permittedTodoList.includes(req.params.todoId);
  }
}
