import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDTO } from './dto/create-order-item-dto';
import { OrderItemRepository } from './order-item.repository';

@Controller('order-item')
export class OrderItemController {
  constructor(
    private readonly orderService: OrderItemService,
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  @Post()
  async create(@Body() data: CreateOrderItemDTO) {
    return this.orderService.create(data);
  }

  @Get()
  async getAllProducts() {
    return this.orderItemRepository.findAll();
  }
}
