import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order-dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDTO: CreateOrderDTO) {
    const order = await this.orderService.createOrder(createOrderDTO);
    return {
      message: 'Order created successfully',
      order,
    };
  }
}
