import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderItemModule } from 'src/order-item/order-item.module';
import { PushoverService } from 'src/pushover/pushover.service';

@Module({
  controllers: [OrderController],
  providers: [PrismaService, OrderService, OrderRepository],
  imports: [OrderItemModule, PushoverService],
})
export class OrderModule {}
