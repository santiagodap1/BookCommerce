import { registerAs } from '@nestjs/config';

export type DatabaseConfig = {
  url?: string;
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  ssl: boolean;
};

export default registerAs<DatabaseConfig>('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  name: process.env.DB_NAME ?? 'bookcommerce',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  ssl: (process.env.DB_SSL ?? 'false').toLowerCase() === 'true',
}));
