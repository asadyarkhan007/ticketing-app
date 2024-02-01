import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 404 if invalid id is provided", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 10,
    })
    .expect(404);
});

it("returns 401 if user not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "test",
      price: 10,
    })
    .expect(401);
});

it("returns a 401 if user does not own a ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "test2",
      price: 20,
    })
    .expect(401);
});

it("returns a 400 if user provide invalid title or price", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("update ticket if valid inputs are provided", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 10,
    })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title2",
      price: 20,
    })
    .expect(200);

  expect(updateResponse.body.price).toEqual(20);
  expect(updateResponse.body.title).toEqual("title2");
  expect(updateResponse.body.userId).toEqual(response.body.userId);
});
