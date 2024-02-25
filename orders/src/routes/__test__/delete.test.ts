import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@asticketservice/common";
import { natsWrapper } from "../../nats-wrapper";
const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("delete order successfully", async () => {
  const ticket1 = await buildTicket();

  const user1 = global.signin();

  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  const responseGet1 = await request(app)
    .get(`/api/orders/${order1.id}`)
    .set("Cookie", user1)
    .expect(200);
  expect(responseGet1.body.id).toEqual(order1.id);

  await request(app)
    .delete(`/api/orders/${order1.id}`)
    .set("Cookie", user1)
    .expect(204);

  const { body: order2 } = await request(app)
    .get(`/api/orders/${order1.id}`)
    .set("Cookie", user1)
    .expect(200);

  expect(order2.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.jsm.jetstream().publish).toHaveBeenCalled();
});
