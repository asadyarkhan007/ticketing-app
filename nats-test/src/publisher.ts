import { connect, StringCodec } from "nats";

const publishMessages = async () => {
  console.clear();
  const nc = await connect({ servers: "127.0.0.1:4222" });

  // create a codec
  const sc = StringCodec();

  const data1 = JSON.stringify({
    id: "1",
    title: "concert1",
    price: 100,
  });

  const data2 = JSON.stringify({
    id: "2",
    title: "concert2",
    price: 200,
  });

  // publish some messages
  nc.publish("ticket:created", sc.encode(data1));
  nc.publish("ticket:created", sc.encode(data2));

  // close the connection after a short delay to allow time for messages to be processed
  setTimeout(async () => {
    await nc.close();
  }, 4000); // You may adjust the delay as needed
};

publishMessages();
