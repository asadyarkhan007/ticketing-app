import { JsMsg } from "nats";
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
} from "@asticketservice/common";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly stream = "payment";
  readonly consumerName = "order-service";

  async onMessage(data: PaymentCreatedEvent["data"], msg: JsMsg) {
    const { id, orderId, stripeId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    order.set({
      status: OrderStatus.Completed,
    });

    await order.save();

    msg.ack();
  }
}
