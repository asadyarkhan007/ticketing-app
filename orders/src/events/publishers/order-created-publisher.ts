import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@asticketservice/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream = "order";
  readonly consumerName = "order-service";
}
