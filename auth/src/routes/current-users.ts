import { Router, Request, Response } from "express";
import { currentUser } from "@asticketservice/common";
import { requireAuth } from "@asticketservice/common";
const router = Router();
router.get(
  "/api/users/currentuser",
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
