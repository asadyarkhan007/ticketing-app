import { Router, Request, Response } from "express";
import { URLNotFoundError } from "../errors/not-found-error";
const router = Router();

router.all("*", (req: Request, res: Response) => {
  throw new URLNotFoundError();
});

export { router as otherRoutes };
