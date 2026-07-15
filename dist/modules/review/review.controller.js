"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const review_service_1 = require("./review.service");
const createReview = async (req, res) => {
    try {
        const tenantId = req.user.id;
        const result = await review_service_1.ReviewServices.createReviewIntoDB(tenantId, req.body);
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
exports.ReviewControllers = {
    createReview,
};
