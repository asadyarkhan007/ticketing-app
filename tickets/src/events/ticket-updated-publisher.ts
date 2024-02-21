import {
  Subjects,
  Publisher,
  TicketUpdatedEvent,
} from "@asticketservice/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly stream = "ticketing";
  readonly consumerName = "ticket-service";
}
