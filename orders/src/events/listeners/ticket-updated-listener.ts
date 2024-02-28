import { JsMsg } from "nats";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@asticketservice/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly stream = "ticket";
  readonly consumerName = "order-service";

  async onMessage(data: TicketUpdatedEvent["data"], msg: JsMsg) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent({
      id,
      version,
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
