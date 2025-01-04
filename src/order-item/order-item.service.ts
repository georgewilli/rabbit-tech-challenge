import { Injectable } from '@nestjs/common';
import { PushoverService } from 'src/pushover/pushover.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemDTO } from './dto/create-order-item-dto';
import { OrderItemRepository } from './order-item.repository';
import { OrderItemDTO } from './dto/order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private orderItemRepository: OrderItemRepository) {}
  async create(orderData: CreateOrderItemDTO) {
    const newOrder = await this.orderItemRepository.create(orderData);
    return newOrder;
  }
  async createOrderItems(orderId: number, items: OrderItemDTO[]): Promise<void> {
    const createPromises = items.map((item) =>
      this.create({ orderId, productId: item.productId, quantity: item.quantity }),
    );
    await Promise.all(createPromises); // Execute all creations concurrently
  }
}
