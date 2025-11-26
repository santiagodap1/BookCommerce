import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user!: User

  @Column()
  label!: string

  @Column({ name: 'recipient_name' })
  recipientName!: string

  @Column()
  street!: string

  @Column()
  city!: string

  @Column({ nullable: true })
  state?: string

  @Column({ name: 'postal_code' })
  postalCode!: string

  @Column()
  country!: string

  @Column({ nullable: true })
  phone?: string

  @Column({ name: 'is_default', default: false })
  isDefault!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
