import { Listener, OrderCreatedEvent, Subjects } from "@asticketservice/common";
import { JsMsg } from "nats";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly stream: string = "order";
  readonly consumerName: string = "expiration-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    console.log("Message recevied for expiration for order", data.id);
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
