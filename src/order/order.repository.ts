import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDTO } from './dto/create-order-dto';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(customerId: number) {
    return await this.prisma.order.create({
      data: { customerId },
    });
  }
}
