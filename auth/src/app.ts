import express from "express";
import { errorHandler } from "./middleware/error-handlers";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-users";
import { signoutRouter } from "./routes/signout";
import { otherRoutes } from "./routes/other-routes";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(otherRoutes);
app.use(errorHandler);

export { app };
