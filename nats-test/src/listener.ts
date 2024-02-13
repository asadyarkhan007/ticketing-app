import { connect, StringCodec, Msg } from "nats";

const subscribeToMessages = async () => {
  console.clear();
  const nc = await connect({ servers: "127.0.0.1:4222" });

  // create a codec
  const sc = StringCodec();

  // create a simple subscriber and iterate over messages
  // matching the subscription
  const sub = nc.subscribe("ticket:created");

  // subscribe to messages
  (async () => {
    for await (const m of sub) {
      console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    }

    // subscriber will close the connection after processing messages
    await nc.close();
  })();
};

subscribeToMessages();
