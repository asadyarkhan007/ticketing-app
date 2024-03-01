import { ExpirationCompleteListener } from "../expiration-complete-listeners";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@asticketservice/common";
import { JsMsg } from "nats";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.jsm);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asad",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { ticket, order, data, msg, listener };
};

it("updat the order status to cancelled", async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an order canncelled event", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  //expect(natsWrapper.jsm.jetstream().publish as jest.Mock).toHaveBeenCalled();

  //   const eventData = JSON.parse(
  //     (natsWrapper.jsm.jetstream().publish as jest.Mock).mock.calls[0][1]
  //   );
  //expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
