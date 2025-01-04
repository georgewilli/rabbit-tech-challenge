import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { PushoverService } from 'src/pushover/pushover.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderRepository } from './order.repository';
import { OrderItemService } from 'src/order-item/order-item.service';

@Injectable()
export class OrderService {
  private pushoverService: PushoverService;
  constructor(
    private orderRepository: OrderRepository,
    private orderItemService: OrderItemService,
  ) {
    this.pushoverService = new PushoverService();
  }
  async createOrder(orderData: CreateOrderDTO) {
    const newOrder = await this.orderRepository.create(orderData.customerId);
    const notificationMessage = `A new order has been created with ID: ${newOrder.id}`;
    await this.pushoverService.sendNotification(notificationMessage);
    await this.orderItemService.createOrderItems(newOrder.id, orderData.items);
    return newOrder;
  }
}
