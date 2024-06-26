import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";

const start = async () => {
  console.log("Payment starting up");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

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
  new OrderCancelledListener(natsWrapper.jsm).listen();

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Payments - Listening on 3000!");
  });
};

start();
