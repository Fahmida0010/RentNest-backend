import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    propertyId: z.string({
      message: "Property ID is required",
    }),
    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    comment: z
      .string()
      .min(1, "Comment is required"),
  }),
});

export const ReviewValidations = {
  createReviewValidationSchema,
};