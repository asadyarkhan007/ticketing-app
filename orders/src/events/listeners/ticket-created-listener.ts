import { JsMsg } from "nats";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@asticketservice/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly stream = "ticketing";
  readonly consumerName = "order-service";

  async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}
