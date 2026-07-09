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
      // 🛠️ ফিক্স: সরাসরি রেসপন্স না পাঠিয়ে এররটি গ্লোবাল হ্যান্ডলারে চালান করে দিন
      next(error);
    }
  };

export default validateRequest;