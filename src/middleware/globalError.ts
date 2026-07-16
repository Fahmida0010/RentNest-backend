import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: any = err;

  
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message, 
    }));
  }

  
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = err.message;
    errorDetails = err.meta;
  }

  else if (err instanceof Error) {
    statusCode = 400;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalError;