import {
  Listener,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@asticketservice/common";
import { JsMsg } from "nats";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream: string = "order";
  readonly consumerName: string = "expiration-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
