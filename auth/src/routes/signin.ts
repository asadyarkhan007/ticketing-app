import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validate-request";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new RequestValidationError("Invalid Credentials");
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new RequestValidationError("Invalid Credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    // Store it on sessionobject

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
