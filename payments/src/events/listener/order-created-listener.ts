import { Listener, OrderCreatedEvent, Subjects } from "@asticketservice/common";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream: string = "order";
  readonly consumerName: string = "payment-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
