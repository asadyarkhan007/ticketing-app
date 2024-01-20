import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { validateResult } from "../middleware/validate-result";
import jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/api/users/signup",
  [body("email").isEmail(), body("password").isLength({ min: 4, max: 12 })],
  validateResult,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new RequestValidationError("Email already taken", []);
    }
    const user = User.build({ email, password });
    let userCretaed = await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      { id: userCretaed.id, email: userCretaed.email },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    // Store it on sessionobject

    res.status(201).json(userCretaed);
  }
);

export { router as signupRouter };
