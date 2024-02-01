import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  private static readonly RESOURCE_NOT_FOUND: string = "Resource not found";
  constructor() {
    super(NotFoundError.RESOURCE_NOT_FOUND);
    this.message = NotFoundError.RESOURCE_NOT_FOUND;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
