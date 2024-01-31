import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  private static readonly NOT_AUTHORIZED: string = "Not Authorized";
  constructor() {
    super(NotAuthorizedError.NOT_AUTHORIZED);
    this.message = NotAuthorizedError.NOT_AUTHORIZED;

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
}
