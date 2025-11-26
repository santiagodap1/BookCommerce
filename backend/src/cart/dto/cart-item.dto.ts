import { Expose } from 'class-transformer';

export class CartItemDto {
  @Expose()
  id!: string;

  @Expose()
  bookId!: string;

  @Expose()
  title!: string;

  @Expose()
  author?: string;

  @Expose()
  coverUrl?: string;

  @Expose()
  price!: number;

  @Expose()
  quantity!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
