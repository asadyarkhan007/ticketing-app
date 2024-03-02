import express, { Request, Response } from "express";
import { body } from "express-validator";
import { stripe } from "../stripe";
import {
  CustomError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@asticketservice/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").notEmpty(), body("orderId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status == OrderStatus.Cancelled) {
      throw new CustomError("Invalid Order Status");
    }
    console.log(process.env.STRIPE_KEY);

    await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
