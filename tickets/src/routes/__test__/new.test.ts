import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listeing to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be access if user sign in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("return status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("return error if invalid title provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    });
  expect(response.status).toEqual(400);
});

it("return error if invalid price  provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Title",
      price: -23,
    });
  expect(response.status).toEqual(400);
});

it("it create tickets with valid input", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Title",
      price: 23,
    });
  expect(response.status).toEqual(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(23);
});

it("publishes an event", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Title",
      price: 23,
    });
  expect(response.status).toEqual(201);
  expect(natsWrapper.jsm.jetstream().publish).toHaveBeenCalled();
});
