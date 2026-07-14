import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import { ReviewValidations } from "./review.validation";
import validateRequest from "../../middleware/validate";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth("TENANT"),
  validateRequest(
    ReviewValidations.createReviewValidationSchema
  ),
  ReviewControllers.createReview
);

export const ReviewRoutes = router;