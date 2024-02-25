import express, { Request, Response } from "express";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@asticketservice/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.jsm).publish({
      id: order.id,
      userId: order.userId,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
