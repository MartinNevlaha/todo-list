import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService: ConfigService = new ConfigService();

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/migration/*.{js,ts}'],
};

const dataSource = new DataSource(dataSourceOption);

export default dataSource;
