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

  async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    console.log("updated listener called");
    const { id, title, price } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
