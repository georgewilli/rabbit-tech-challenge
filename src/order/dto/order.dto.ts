import { OrderItemDTO } from "src/order-item/dto/order-item.dto";

export class OrderDTO {
  id: number;
  customerId: number;
  items: OrderItemDTO[]; // Includes items in the order
  createdAt: Date;
}
