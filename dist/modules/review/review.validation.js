"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidations = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string({
            message: "Property ID is required",
        }),
        rating: zod_1.z
            .number()
            .int()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot be more than 5"),
        comment: zod_1.z
            .string()
            .min(1, "Comment is required"),
    }),
});
exports.ReviewValidations = {
    createReviewValidationSchema,
};
