import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { rentalRequestId } = req.body;
    const userId = (req as any).user.id;

    const result = await PaymentService.createPaymentSession(rentalRequestId, userId);
    res.status(200).json({ success: true, message: 'Payment session created', data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { status, tran_id } = req.query;

    await PaymentService.confirmPayment(tran_id as string, status as string);

    // ফ্রন্টএন্ডের সাকসেস বা ফেইল পেজে রিডাইরেক্ট করে দেওয়া (আপনার ফ্রন্টএন্ড URL অনুযায়ী চেঞ্জ করবেন)
    if (status === 'SUCCESS') {
      res.redirect('http://localhost:5000/payment/success');
    } else {
      res.redirect('http://localhost:5000/payment/failed');
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    const result = await PaymentService.getPaymentHistory(userId, role);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await PaymentService.getPaymentDetails(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const PaymentController = {
  createPaymentSession,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
};