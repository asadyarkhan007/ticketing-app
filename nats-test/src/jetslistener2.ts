import { connect, StringCodec, QueuedIterator, JsMsg, AckPolicy } from "nats";

const createConsumer = async () => {
  const nc = await connect({ servers: "127.0.0.1:4222" });

  const jsm = await nc.jetstreamManager();
  const stream = "ticketing46";
  const consumer = "ticket-service";
  const subj1 = "ticket:created3";
  const subj2 = "ticket:updated1";

  try {
    console.log(1);
    await jsm.consumers.info(stream, consumer);
  } catch (err) {
    try {
      console.log(2);

      const myStream = await jsm.streams.info(stream);
      console.log(2.2);
      console.log(myStream.config.subjects);
      console.log(myStream);
      if (!myStream || myStream.config.name !== stream) {
        console.log(3);
        await jsm.streams.add({
          name: stream,
          subjects: [subj1],
        });
      }
    } catch (err) {
      console.error(err);
      console.log(4);
      await jsm.streams.add({
        name: stream,
        subjects: [subj1],
      });
    }
    console.log(5);
    await jsm.consumers.add(stream, {
      durable_name: consumer,
      ack_policy: AckPolicy.Explicit,
    });
  }
  console.log(6);
};

const subscribeToMessages = async () => {
  console.clear();
  const nc = await connect({ servers: "127.0.0.1:4222" });

  // Ensure the consumer exists
  //const subj1 = "ticket:created";
  await createConsumer();
  //const subj2 = "ticket-updated";
  // await createConsumer(subj2);
  return;
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
