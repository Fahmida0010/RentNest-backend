import { Router } from 'express';
import auth from '../../middleware/auth';
import { PaymentController } from './payment.controller';

const router = Router();

// Create payment session (Tenant only)
router.post('/create', auth('TENANT'), PaymentController.createPaymentSession);

// SSLCommerz Callbacks (এগুলোতে auth মিডলওয়্যার বসানো যাবে না, কারণ SSLCommerz সার্ভার সরাসরি হিট করবে)
router.post('/confirm', PaymentController.confirmPayment);

// Payment History & Details
router.get('/', auth(), PaymentController.getPaymentHistory);
router.get('/:id', auth(), PaymentController.getPaymentDetails);

export const PaymentRoutes = router;