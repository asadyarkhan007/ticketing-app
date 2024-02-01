import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { CustomError } from "@asticketservice/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
  const id = req.params.id;
  const myArr: any[] = [];
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new CustomError("Id Not found", myArr);
  }
  res.status(200).send(ticket);
});

export { router as showTicketRouter };
