import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { Address } from '../addresses/entities/address.entity'
import { CartItem } from '../cart/entities/cart-item.entity'
import { CartService } from '../cart/cart.service'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    private readonly cartService: CartService,
  ) {}

  async create(userId: string, payload: CreateOrderDto) {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
    })

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty')
    }

    const address = await this.addressRepository.findOne({
      where: { id: payload.addressId, user: { id: userId } },
    })

    if (!address) {
      throw new NotFoundException('Address not found')
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    const order = this.ordersRepository.create({
      user: { id: userId } as any,
      totalPrice: Number(total.toFixed(2)),
      shippingName: address.recipientName,
      shippingStreet: address.street,
      shippingCity: address.city,
      shippingState: address.state,
      shippingPostalCode: address.postalCode,
      shippingCountry: address.country,
      shippingPhone: address.phone,
      items: cartItems.map((item) =>
        this.orderItemsRepository.create({
          bookId: item.bookId,
          title: item.title,
          author: item.author,
          coverUrl: item.coverUrl,
          price: item.price,
          quantity: item.quantity,
        }),
      ),
    })

    const saved = await this.ordersRepository.save(order)
    await this.cartService.clear(userId)
    return saved
  }

  findAll(userId: string) {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['items'],
    })
  }

  async findOne(userId: string, id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['items'],
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    return order
  }
}
