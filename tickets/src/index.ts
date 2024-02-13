import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  await natsWrapper.connect("ticketing", "http://nats-srv:4222");

  natsWrapper.client.closed().then((err) => {
    console.log(
      `connection closed ${err ? " with error: " + err.message : ""}`
    );
    process.exit();
  });
  process.on("SIGINT", () => natsWrapper.client?.close());
  process.on("SIGTERM", () => natsWrapper.client?.close());

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
  await app.listen(3000, () => {
    console.log("Ticket - Listening on 3000!");
  });
};

start();
