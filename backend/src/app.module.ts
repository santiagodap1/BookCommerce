import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { validate } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('database.url');
        const isProduction = configService.get('NODE_ENV') === 'production';
        const sslEnabled = configService.get<boolean>('database.ssl');

        const baseConfig = databaseUrl
          ? {
              type: 'postgres' as const,
              url: databaseUrl,
            }
          : {
              type: 'postgres' as const,
              host: configService.get<string>('database.host'),
              port: configService.get<number>('database.port'),
              database: configService.get<string>('database.name'),
              username: configService.get<string>('database.user'),
              password: configService.get<string>('database.password'),
            };

        return {
          ...baseConfig,
          autoLoadEntities: true,
          synchronize: !isProduction,
          ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
        };
      },
    }),
    UsersModule,
    AuthModule,
    CartModule,
    AddressesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
