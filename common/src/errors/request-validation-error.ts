import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  constructor(message: string, errors?: ValidationError[]) {
    super(message, RequestValidationError.transformErrorDetail(errors));
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  static transformErrorDetail(
    validationErrors: ValidationError[] | undefined
  ): string[] {
    let errorDetail: string[] = [];
    if (validationErrors) {
      validationErrors.forEach((error: ValidationError) => {
        if (error.type === "field") {
          errorDetail.push(
            `Field: ${error.path} - ${error.msg}, value: ${error.value}`
          );
        } else {
          errorDetail.push(`${error.msg}`);
        }
      });
    }
    return errorDetail;
  }
}
