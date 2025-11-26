import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Address } from '../addresses/entities/address.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

const databaseUrl = process.env.DATABASE_URL;

const baseConfig: DataSourceOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME ?? 'bookcommerce',
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
    };

export const AppDataSource = new DataSource({
  ...baseConfig,
  entities: [User, CartItem, Address, Order, OrderItem],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
  ssl:
    (process.env.DB_SSL ?? 'false').toLowerCase() === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
});
