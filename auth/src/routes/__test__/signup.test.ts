import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("return a 400 on invalid email on signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "abcd.com",
      password: "password",
    })
    .expect(400);
});

it("return a 400 on invalid password on signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "abcd@gmail.com",
      password: "1",
    })
    .expect(400);
});

it("return a 400 on not provided email and password on signup", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallow duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test1@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test1@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test2@test.com",
      password: "password",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
