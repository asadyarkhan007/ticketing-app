import { ValidationError } from "express-validator";

export class CustomError extends Error {
  public timestamp;
  constructor(message: string, public detail?: any[]) {
    super(message);
    this.timestamp = new Date();
    this.detail = this.transformErrorDetail(detail);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  protected transformErrorDetail(detail: any[] | undefined): any[] {
    return detail || [];
  }
}
