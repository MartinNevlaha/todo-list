import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db-service',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'todo',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
