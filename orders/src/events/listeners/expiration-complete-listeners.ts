import { JsMsg } from "nats";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  ExpirationCompleteEvent,
  NotFoundError,
  OrderStatus,
} from "@asticketservice/common";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  readonly stream = "expiration";
  readonly consumerName = "order-service";

  async onMessage(data: ExpirationCompleteEvent["data"], msg: JsMsg) {
    console.log("expiration event received for order", data.orderId);
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.jsm).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
