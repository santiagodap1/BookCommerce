import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AddressesService } from './addresses.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.addressesService.findAll(userId)
  }

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() payload: CreateAddressDto) {
    return this.addressesService.create(userId, payload)
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() payload: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, id, payload)
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.addressesService.remove(userId, id)
  }
}
