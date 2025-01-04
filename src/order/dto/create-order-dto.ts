import { OrderItemDTO } from "src/order-item/dto/order-item.dto";

export class CreateOrderDTO {
  customerId: number; // Customer placing the order
  items: OrderItemDTO[]; // Array of items in the order
}
