import {
  Subjects,
  Publisher,
  TicketCreatedEvent,
} from "@asticketservice/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly stream = "ticket";
  readonly consumerName = "ticket-service";
}
