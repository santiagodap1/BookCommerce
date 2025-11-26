import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.ordersService.findAll(userId)
  }

  @Get(':id')
  detail(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.ordersService.findOne(userId, id)
  }

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() payload: CreateOrderDto) {
    return this.ordersService.create(userId, payload)
  }
}
