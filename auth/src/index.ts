import express from "express";
import { errorHandler } from "./middleware/error-handlers";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-users";
import { signoutRouter } from "./routes/signout";
import { otherRoutes } from "./routes/other-routes";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(otherRoutes);
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {});
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Auth - Listening on 3000!");
  });
};

start();
