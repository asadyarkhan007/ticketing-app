import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
  OrderCancelledEvent,
} from "@asticketservice/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly stream = "order";
}
