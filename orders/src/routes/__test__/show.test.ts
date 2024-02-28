import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@asticketservice/common";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches order for by own user", async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order2.id}`)
    .set("Cookie", user2)
    .expect(200);
  expect(response.body.id).toEqual(order2.id);
});

it("fetches order of other user", async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();
  //

  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order1.id}`)
    .set("Cookie", user2)
    .expect(401);
});
