import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: any) {
      next(error);
    }
  };

export default validateRequest;