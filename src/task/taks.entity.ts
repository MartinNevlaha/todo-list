import { TodoList } from 'src/todo-list/todo-list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './dto/task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  text: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column()
  creator: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => TodoList, (todo) => todo.tasks, { eager: false })
  todo: TodoList;
}
