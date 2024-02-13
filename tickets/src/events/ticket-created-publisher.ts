import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@asticketservice/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly stream = "Ticketing";
  readonly consumerName = "ticket-service";
}
