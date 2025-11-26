import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Address } from './entities/address.entity'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  findAll(userId: string) {
    return this.addressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    })
  }

  async create(userId: string, payload: CreateAddressDto) {
    if (payload.isDefault) {
      await this.clearDefault(userId)
    }

    const address = this.addressRepository.create({
      ...payload,
      user: { id: userId } as any,
    })

    return this.addressRepository.save(address)
  }

  async update(userId: string, id: string, payload: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: userId } },
    })

    if (!address) {
      throw new NotFoundException('Address not found')
    }

    if (payload.isDefault) {
      await this.clearDefault(userId, id)
    }

    Object.assign(address, payload)
    return this.addressRepository.save(address)
  }

  async remove(userId: string, id: string) {
    const result = await this.addressRepository.delete({
      id,
      user: { id: userId } as any,
    })

    if (result.affected === 0) {
      throw new NotFoundException('Address not found')
    }
  }

  private async clearDefault(userId: string, excludeId?: string) {
    const qb = this.addressRepository
      .createQueryBuilder()
      .update(Address)
      .set({ isDefault: false })
      .where('user_id = :userId', { userId })

    if (excludeId) {
      qb.andWhere('id <> :excludeId', { excludeId })
    }

    await qb.execute()
  }
}
