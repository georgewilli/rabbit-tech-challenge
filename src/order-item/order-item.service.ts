import { Injectable } from '@nestjs/common';
import { CreateOrderItemDTO } from './dto/create-order-item-dto';
import { OrderItemRepository } from './order-item.repository';
import { OrderItemDTO } from './dto/order-item.dto';
import { OrderItem } from '@prisma/client';


@Injectable()
export class OrderItemService {
  
  constructor(  
    private orderItemRepository: OrderItemRepository,
    ){
  }
  async create(orderData: CreateOrderItemDTO) {
    const newOrder = await this.orderItemRepository.create(
       orderData,
    );
    return newOrder;
  }

  async createOrderItems(orderId: number, items: OrderItemDTO[]): Promise<OrderItem[]> {
    const createPromises = items.map(item =>
      this.create({orderId, productId : item.productId , quantity: item.quantity}),
    );
   const orderItems = await Promise.all(createPromises); 
    return orderItems
  }
}
