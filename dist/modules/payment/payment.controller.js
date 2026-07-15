"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
// Create Payment Session
const createPaymentSession = async (req, res) => {
    try {
        const { rentalRequestId } = req.body;
        const userId = req.user.id;
        const result = await payment_service_1.PaymentService.createPaymentSession(rentalRequestId, userId);
        return res.status(200).json({
            success: true,
            message: "Payment session created",
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Payment Confirm Callback
const confirmPayment = async (req, res) => {
    try {
        const { status, tran_id } = req.query;
        if (!tran_id || !status) {
            return res.redirect(`${BACKEND_URL}/api/payments/fail`);
        }
        await payment_service_1.PaymentService.confirmPayment(tran_id, status);
        if (status === "SUCCESS" || status === "VALID") {
            return res.redirect(`${BACKEND_URL}/api/payments/success`);
        }
        return res.redirect(`${BACKEND_URL}/api/payments/fail`);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Payment confirmation failed",
        });
    }
};
// Payment Success
const paymentSuccess = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Payment successful",
    });
};
// Payment Failed
const paymentFail = async (req, res) => {
    return res.status(400).json({
        success: false,
        message: "Payment failed",
    });
};
// Payment Cancelled
const paymentCancel = async (req, res) => {
    return res.status(400).json({
        success: false,
        message: "Payment cancelled",
    });
};
// Payment History
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const result = await payment_service_1.PaymentService.getPaymentHistory(userId, role);
        return res.status(200).json({
            success: true,
            message: "Payment history fetched successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Payment Details
const getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await payment_service_1.PaymentService.getPaymentDetails(id);
        return res.status(200).json({
            success: true,
            message: "Payment details fetched successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.PaymentController = {
    createPaymentSession,
    confirmPayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    getPaymentHistory,
    getPaymentDetails,
};
