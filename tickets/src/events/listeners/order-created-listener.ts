import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  OrderCreatedEvent,
} from "@asticketservice/common";
import { JsMsg } from "nats";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream = "ticketing";
  readonly consumerName = "ticket-service";

  onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    console.log("Event data!", data);

    console.log(data.id);

    msg.ack();
  }
}
