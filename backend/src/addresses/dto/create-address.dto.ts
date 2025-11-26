import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateAddressDto {
  @IsString()
  @MaxLength(50)
  label!: string

  @IsString()
  @MaxLength(100)
  recipientName!: string

  @IsString()
  @MaxLength(160)
  street!: string

  @IsString()
  @MaxLength(80)
  city!: string

  @IsOptional()
  @IsString()
  @MaxLength(80)
  state?: string

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  postalCode!: string

  @IsString()
  @MaxLength(80)
  country!: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}
