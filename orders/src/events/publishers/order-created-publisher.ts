import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@asticketservice/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream = "ticketing";
  readonly consumerName = "order-service";
}
