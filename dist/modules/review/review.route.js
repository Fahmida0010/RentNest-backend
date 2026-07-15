"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const validate_1 = __importDefault(require("../../middleware/validate"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("TENANT"), (0, validate_1.default)(review_validation_1.ReviewValidations.createReviewValidationSchema), review_controller_1.ReviewControllers.createReview);
exports.ReviewRoutes = router;
