import {
  connect,
  StringCodec,
  QueuedIterator,
  JsMsg,
  AckPolicy,
  JetStreamClient,
} from "nats";

const createConsumer = async () => {
  const nc = await connect({ servers: "127.0.0.1:4222" });

  const jsm = await nc.jetstreamManager();
  const stream = "ticketing";
  const consumer = "productConsumer";

  // Check if the consumer already exists
  try {
    await jsm.consumers.info(stream, consumer);
  } catch (err) {
    await jsm.consumers.add(stream, {
      durable_name: consumer,
      ack_policy: AckPolicy.Explicit,
    });
  }
};

const subscribeToMessages = async () => {
  console.clear();
  const nc = await connect({ servers: "127.0.0.1:4222" });

  // Ensure the consumer exists
  await createConsumer();
  const stream = "ticketing";
  const subj = `product.*`;
  const consumer = "productConsumer";
  const jsm = await nc.jetstreamManager();
  await jsm.streams.add({ name: stream, subjects: [subj] });
  const js = jsm.jetstream();

  const c = await js.consumers.get(stream, consumer);
  const messages = await c.consume();
  for await (const m of messages) {
    console.log(`sequence: ${m.seq} message: ${m.data}`);
    //m.ack();
  }

  // retrieve an existing consumer

  // const c = await js.consumers.get(stream, consumer);

  // for (let i = 0; i < 5; i++) {
  //   let messages = await c.fetch({ max_messages: 2, expires: 2000 });
  //   for await (const m of messages) {
  //     console.log("my msg:" + m.subject);
  //     // m.ack();
  //   }
  //   console.log(`batch completed: ${messages.getProcessed()} msgs processed`);
  // }
};

subscribeToMessages();

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  private client: any;
  protected ackWait = 5 * 1000;
  protected options: any;

  constructor(client: any) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client.options;
  }

  listen() {
    const subscription = this.client.subscribe();
  }

  parseMessage(msg: JsMsg) {}
}

class TicketCreatedListener extends Listener {
  subject = "ticket.created";
  queueGroupName: string = "payment-service";

  onMessage(data: any, msg: JsMsg) {
    console.log("event");
    msg.ack();
  }
}
