import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_URL);

  natsWrapper.client.closed().then((err) => {
    console.log(
      `connection closed ${err ? " with error: " + err.message : ""}`
    );
    process.exit();
  });
  process.on("SIGINT", () => natsWrapper.client?.close());
  process.on("SIGTERM", () => natsWrapper.client?.close());

  new OrderCreatedListener(natsWrapper.jsm).listen();

  console.log("Expiration - Listening on 3000!");
};

start();
