import request from "supertest";
import { app } from "../../app";

const createTicket = async (title: string, price: number) => {
  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title,
    price,
  });
};

it("can fetch a list of tickets", async () => {
  createTicket("test", 1);
  createTicket("test2", 2);
  createTicket("test3", 3);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
