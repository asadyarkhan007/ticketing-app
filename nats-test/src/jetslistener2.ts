import { connect, StringCodec, QueuedIterator, JsMsg, AckPolicy } from "nats";

const createConsumer = async () => {
  const nc = await connect({ servers: "127.0.0.1:4222" });

  const jsm = await nc.jetstreamManager();
  const stream = "ticketing";
  const subj = "ticket:created";
  const consumer = "ticket-service";

  // Check if the consumer already exists
  try {
    await jsm.consumers.info(stream, consumer);
  } catch (err) {
    //console.warn(err);
    await jsm.streams.add({ name: stream, subjects: [subj] });
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
  const subj = "ticket:created";
  const consumer = "ticket-service";
  const jsm = await nc.jetstreamManager();
  await jsm.streams.add({ name: stream, subjects: [subj] });
  const js = jsm.jetstream();

  const c = await js.consumers.get(stream, consumer);
  const messages = await c.consume();
  for await (const m of messages) {
    console.log(
      `Message received: ${subj} / ${consumer} sequence: ${m.seq} message: ${m.data}`
    );
    m.ack();
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
