"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Create payment session (Tenant only)
router.post('/create', (0, auth_1.default)('TENANT'), payment_controller_1.PaymentController.createPaymentSession);
// SSLCommerz callbacks
router.get("/success", payment_controller_1.PaymentController.paymentSuccess);
router.get("/fail", payment_controller_1.PaymentController.paymentFail);
router.get("/cancel", payment_controller_1.PaymentController.paymentCancel);
// SSLCommerz Callbacks (এগুলোতে auth মিডলওয়্যার বসানো যাবে না, কারণ SSLCommerz সার্ভার সরাসরি হিট করবে)
router.post('/confirm', payment_controller_1.PaymentController.confirmPayment);
// Payment History & Details
router.get('/', (0, auth_1.default)(), payment_controller_1.PaymentController.getPaymentHistory);
router.get('/:id', (0, auth_1.default)(), payment_controller_1.PaymentController.getPaymentDetails);
exports.PaymentRoutes = router;
