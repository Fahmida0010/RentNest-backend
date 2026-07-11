export type TPaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface TPaymentData {
  rentalRequestId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}