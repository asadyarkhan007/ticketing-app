import {
  NotFoundError,
  OrderStatus,
  RequestValidationError,
  requireAuth,
  validateRequest,
} from "@asticketservice/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").notEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user  is trying to rder in the db
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const reserved = await ticket.isReserved();
    // Make sure ethe ticket is not resvered
    // Run query to look at all orders. Find an order where the ticket
    if (reserved) {
      throw new RequestValidationError("Ticket is already reserved");
    }

    // Calculate an expiration date of this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // Buld the order and save it to the database

    const order = Order.build({
      userId: req.currentUser ? req.currentUser.id : undefined,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    // Publish an event saying an order was created

    await new OrderCreatedPublisher(natsWrapper.jsm).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
