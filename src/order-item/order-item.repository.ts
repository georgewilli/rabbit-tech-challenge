import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderItem } from '@prisma/client';
import { CreateOrderItemDTO } from './dto/create-order-item-dto';

@Injectable()
export class OrderItemRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderItemDTO): Promise<OrderItem> {
    return this.prisma.orderItem.create({ data });
  }
  async findAll(): Promise<OrderItem[]> {
    return await this.prisma.orderItem.findMany({
      orderBy: {
        quantity: 'desc', // Orders the result by 'quantity' in descending order
      },
    });
  }
}
