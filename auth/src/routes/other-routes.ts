import { Router, Request, Response } from "express";
import { URLNotFoundError } from "@asticketservice/common";
const router = Router();

router.all("*", (req: Request, res: Response) => {
  throw new URLNotFoundError();
});

export { router as otherRoutes };
