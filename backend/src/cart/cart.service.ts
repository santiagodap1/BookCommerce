import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ManageCartItemDto } from './dto/manage-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
  ) {}

  async list(userId: string): Promise<CartItemDto[]> {
    const items = await this.cartRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    return items.map((item) => this.toDto(item));
  }

  async addOrIncrement(userId: string, payload: ManageCartItemDto): Promise<CartItemDto> {
    let item = await this.cartRepository.findOne({
      where: { user: { id: userId }, bookId: payload.bookId },
    });

    if (item) {
      item.quantity += payload.quantity;
      item.price = payload.price;
      item.title = payload.title;
      item.author = payload.author;
      item.coverUrl = payload.coverUrl;
    } else {
      item = this.cartRepository.create({
        ...payload,
        user: { id: userId } as User,
      });
    }

    const saved = await this.cartRepository.save(item);
    return this.toDto(saved);
  }

  async updateQuantity(userId: string, bookId: string, payload: UpdateCartItemDto): Promise<CartItemDto> {
    const item = await this.cartRepository.findOne({
      where: { user: { id: userId }, bookId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = payload.quantity;
    const saved = await this.cartRepository.save(item);
    return this.toDto(saved);
  }

  async removeItem(userId: string, bookId: string): Promise<void> {
    const result = await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where('user_id = :userId AND book_id = :bookId', { userId, bookId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async clear(userId: string): Promise<void> {
    await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where('user_id = :userId', { userId })
      .execute();
  }

  private toDto(entity: CartItem): CartItemDto {
    return plainToInstance(CartItemDto, entity, { excludeExtraneousValues: true });
  }
}
