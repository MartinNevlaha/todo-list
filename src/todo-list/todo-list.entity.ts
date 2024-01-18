import { Exclude } from 'class-transformer';
import { Task } from 'src/task/taks.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Exclude({ toPlainOnly: true })
  @ManyToMany(() => User, (user) => user.todoLists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];

  @OneToMany(() => Task, (task) => task.todo, { eager: true })
  tasks: Task[];
}
