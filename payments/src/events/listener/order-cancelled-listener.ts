import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@asticketservice/common";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly stream: string = "order";
  readonly consumerName: string = "payment-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    msg.ack();
  }
}
