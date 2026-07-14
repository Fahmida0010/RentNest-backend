import { Request, Response } from "express";
import { ReviewServices } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user.id;

    const result = await ReviewServices.createReviewIntoDB(
      tenantId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const ReviewControllers = {
  createReview,
};