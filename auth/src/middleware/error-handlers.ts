require("express-async-errors");
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { URLNotFoundError } from "../errors/not-found-error";

function prepareErrorResponseObject(error: CustomError) {
  return {
    timestamp: error.timestamp,
    message: error.message,
    detail: error.detail,
  };
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof URLNotFoundError) {
    res.status(404).json(prepareErrorResponseObject(error));
  } else if (error instanceof CustomError) {
    res.status(400).json(prepareErrorResponseObject(error));
  } else {
    console.error(error.message, error.stack);
    res.status(500).json({
      timestamp: new Date(),
      message: "Something went wrong",
      detail: [],
    });
  }
};
