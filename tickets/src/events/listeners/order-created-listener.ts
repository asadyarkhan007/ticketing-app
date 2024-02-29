import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  OrderCreatedEvent,
  NotFoundError,
} from "@asticketservice/common";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream = "order";
  readonly consumerName = "ticket-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    console.log("Event data!", data);
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    //new TicketUpdatedPublisher(this);

    msg.ack();
  }
}
