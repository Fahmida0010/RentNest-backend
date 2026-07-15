import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

// Create Payment Session
const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { rentalRequestId } = req.body;
    const userId = (req as any).user.id;

    const result = await PaymentService.createPaymentSession(
      rentalRequestId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Payment session created",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Payment Confirm Callback
const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { status, tran_id } = req.query;

    if (!tran_id || !status) {
      return res.redirect(
        `${BACKEND_URL}/api/payments/fail`
      );
    }

    await PaymentService.confirmPayment(
      tran_id as string,
      status as string
    );

    if (status === "SUCCESS" || status === "VALID") {
      return res.redirect(
        `${BACKEND_URL}/api/payments/success`
      );
    }

    return res.redirect(
      `${BACKEND_URL}/api/payments/fail`
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Payment confirmation failed",
    });
  }
};

// Payment Success
const paymentSuccess = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Payment successful",
  });
};

// Payment Failed
const paymentFail = async (req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: "Payment failed",
  });
};

// Payment Cancelled
const paymentCancel = async (req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: "Payment cancelled",
  });
};

// Payment History
const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    const result = await PaymentService.getPaymentHistory(
      userId,
      role
    );

    return res.status(200).json({
      success: true,
      message: "Payment history fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Payment Details
const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await PaymentService.getPaymentDetails(id);

    return res.status(200).json({
      success: true,
      message: "Payment details fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const PaymentController = {
  createPaymentSession,
  confirmPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getPaymentHistory,
  getPaymentDetails,
};