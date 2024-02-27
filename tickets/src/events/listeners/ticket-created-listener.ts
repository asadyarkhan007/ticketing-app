import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@asticketservice/common";
import { JsMsg } from "nats";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly stream = "ticketing";
  readonly consumerName = "ticket-service";

  onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    console.log("Event data!", data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
