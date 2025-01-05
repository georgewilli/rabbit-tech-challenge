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
   const orderItems = await this.orderItemService.createOrderItems(newOrder.id, orderData.items);
   const notificationMessage = `New Order Created: ${newOrder.id}  - ${orderItems.length} items`;
   await this.pushoverService.sendNotification(notificationMessage);
    return newOrder;
  }
}
