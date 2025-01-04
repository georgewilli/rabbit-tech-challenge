import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItemRepository } from './order-item.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrderItemController],
  providers: [PrismaService, OrderItemService, OrderItemRepository],
  exports: [OrderItemService],
})
export class OrderItemModule {}
