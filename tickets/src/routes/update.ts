import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import {
  CustomError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@asticketservice/common";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price can not be negative"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new CustomError("Ticket is reserved, you can not edit");
    }

    if (req.currentUser?.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }
    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.jsm).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
