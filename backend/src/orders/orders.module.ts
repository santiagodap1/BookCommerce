import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { Address } from '../addresses/entities/address.entity'
import { CartItem } from '../cart/entities/cart-item.entity'
import { CartModule } from '../cart/cart.module'

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Address, CartItem]), CartModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
