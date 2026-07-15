import { Router } from 'express';
import auth from '../../middleware/auth';
import { PaymentController } from './payment.controller';

const router = Router();

// Create payment session (Tenant only)
router.post('/create', auth('TENANT'), PaymentController.createPaymentSession);

// SSLCommerz callbacks
router.get("/success", PaymentController.paymentSuccess);
router.get("/fail", PaymentController.paymentFail);
router.get("/cancel", PaymentController.paymentCancel);

// SSLCommerz Callbacks 
router.post('/confirm', PaymentController.confirmPayment);

// Payment History & Details
router.get('/', auth(), PaymentController.getPaymentHistory);
router.get('/:id', auth(), PaymentController.getPaymentDetails);

export const PaymentRoutes = router;