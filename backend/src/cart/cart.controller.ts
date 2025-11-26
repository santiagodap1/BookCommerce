import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ManageCartItemDto } from './dto/manage-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('userId') userId: string) {
    return this.cartService.list(userId);
  }

  @Post()
  addItem(
    @CurrentUser('userId') userId: string,
    @Body() payload: ManageCartItemDto,
  ) {
    return this.cartService.addOrIncrement(userId, payload);
  }

  @Patch(':bookId')
  updateQuantity(
    @CurrentUser('userId') userId: string,
    @Param('bookId') bookId: string,
    @Body() payload: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(userId, bookId, payload);
  }

  @Delete(':bookId')
  @HttpCode(204)
  removeItem(
    @CurrentUser('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.cartService.removeItem(userId, bookId);
  }

  @Delete()
  @HttpCode(204)
  clearCart(@CurrentUser('userId') userId: string) {
    return this.cartService.clear(userId);
  }
}
