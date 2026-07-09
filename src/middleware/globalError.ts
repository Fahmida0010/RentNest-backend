import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client"; // 🛠️ ফিক্স: 'prisma' এর বদলে 'Prisma' হবে (বড় হাতের P)

const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: any = err;

  // 🛠️ জড এরর হ্যান্ডলিং ফিক্স (যাতে অরিজিনাল মেসেজ দেখায়)
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message, // 👈 আপনার সেট করা 'You are not allowed...' মেসেজটি এখানে আসবে
    }));
  }

  // 🛠️ প্রিজমা এরর চেক ফিক্স
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