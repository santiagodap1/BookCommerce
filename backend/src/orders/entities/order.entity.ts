import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { OrderItem } from './order-item.entity'

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user!: User

  @Column({ name: 'status', default: 'PLACED' })
  status!: string

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, transformer: {
    to: (value: number) => value,
    from: (value: string) => Number(value),
  } })
  totalPrice!: number

  @Column({ name: 'shipping_name' })
  shippingName!: string

  @Column({ name: 'shipping_street' })
  shippingStreet!: string

  @Column({ name: 'shipping_city' })
  shippingCity!: string

  @Column({ name: 'shipping_state', nullable: true })
  shippingState?: string

  @Column({ name: 'shipping_postal_code' })
  shippingPostalCode!: string

  @Column({ name: 'shipping_country' })
  shippingCountry!: string

  @Column({ name: 'shipping_phone', nullable: true })
  shippingPhone?: string

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
