import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@asticketservice/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly stream: string = "payment";
}
