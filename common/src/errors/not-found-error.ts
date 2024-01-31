import { CustomError } from "./custom-error";

export class URLNotFoundError extends CustomError {
  private static readonly URL_NOT_FOUND: string = "URL not found";
  constructor() {
    super(URLNotFoundError.URL_NOT_FOUND);
    this.message = URLNotFoundError.URL_NOT_FOUND;

    Object.setPrototypeOf(this, URLNotFoundError.prototype);
  }
}
