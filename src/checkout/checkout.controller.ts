import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Roles } from '../authentication/guards/roles/roles.decorator';
import { IResponse } from '../interfaces/general';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles/roles.guard';

@Controller('checkout')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Get(':id/:location')
  @Roles(['user'])
  async getTransportation(
    @Param('id') id: string,
    @Param('location') location: 'local' | 'other',
  ): Promise<IResponse<number>> {
    const response = await this.checkoutService.getTransportation(id, location);
    return {
      message: 'Customer cart loaded successfully',
      data: response,
    };
  }
}
