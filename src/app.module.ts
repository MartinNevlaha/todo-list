import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TodoListModule } from './todo-list/todo-list.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config-schema/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    UserModule,
    AuthModule,
    TodoListModule,
    DatabaseModule,
    TaskModule,
  ],
})
export class AppModule {}
