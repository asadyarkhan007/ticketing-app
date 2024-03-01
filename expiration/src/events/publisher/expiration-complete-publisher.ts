import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
  ExpirationCompleteEvent,
} from "@asticketservice/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  readonly stream: string = "expiration";
}
