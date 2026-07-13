import SSLCommerzPayment from 'sslcommerz-lts';
import prisma from '../../../prisma/prisma';
import { PaymentProvider, PaymentStatus } from '@prisma/client';



const store_id = process.env.STORE_ID as string;
const store_passwd = process.env.STORE_PASSWORD as string;
const is_live = process.env.IS_LIVE === 'true';

const createPaymentSession = async (rentalRequestId: string, userId: string) => {
  // ১. চেক করা রিকোয়েস্টটি আসলেই APPROVED কিনা
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true, tenant: true },
  });

  if (!rentalRequest) throw new Error('Rental Request not found');
  if (rentalRequest.status !== 'APPROVED') throw new Error('Rental request is not approved yet');
  if (rentalRequest.tenantId !== userId) throw new Error('You do not own this rental request');

  const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const amount = rentalRequest.property.price; // প্রোপার্টির প্রাইস অনুযায়ী অ্যামাউন্ট সেট হচ্ছে

  // ২. SSLCommerz এর ডাটা অবজেক্ট তৈরি করা
  const paymentData = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${process.env.BACKEND_URL}/api/payments/confirm?status=SUCCESS&tran_id=${transactionId}`,
    fail_url: `${process.env.BACKEND_URL}/api/payments/confirm?status=FAILED&tran_id=${transactionId}`,
    cancel_url: `${process.env.BACKEND_URL}/api/payments/confirm?status=CANCELLED&tran_id=${transactionId}`,
    ipn_url: `${process.env.BACKEND_URL}/api/payments/confirm`,
    shipping_method: 'No',
    product_name: rentalRequest.property.title,
    product_category: 'Property Rental',
    product_profile: 'general',
    cus_name: rentalRequest.tenant.name,
    cus_email: rentalRequest.tenant.email,
    cus_add1: rentalRequest.property.location,
    cus_add2: 'N/A',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: rentalRequest.tenant.phone || '01700000000',
    cus_fax: 'N/A',
    ship_name: 'N/A',
    ship_add1: 'N/A',
    ship_add2: 'N/A',
    ship_city: 'N/A',
    ship_state: 'N/A',
    ship_postcode: 'N/A',
    ship_country: 'N/A',
  };

  // ৩. ডাটাবেজে পেমেন্ট রেকর্ড PENDING হিসেবে ক্রিয়েট করা
  await prisma.payment.upsert({
    where: { rentalRequestId: rentalRequestId },
    update: { transactionId, status: PaymentStatus.PENDING, amount },
    create: {
      rentalRequestId,
      amount,
      transactionId,
      provider: 'SSLCOMMERZ' as PaymentProvider,
      status: PaymentStatus.PENDING,
    },
  });

  // ৪. SSLCommerz সেশন জেনারেট করা
  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcommerz.init(paymentData);
  
  if (apiResponse?.GatewayPageURL) {
    return { paymentUrl: apiResponse.GatewayPageURL };
  } else {
    throw new Error('Failed to initiate payment session with SSLCommerz');
  }
};

const confirmPayment = async (tran_id: string, status: string) => {
  if (status === 'SUCCESS') {
    // পেমেন্ট সফল হলে আপডেট
    return await prisma.payment.update({
      where: { transactionId: tran_id },
      data: {
        status: PaymentStatus.SUCCESS,
        paidAt: new Date(),
      },
    });
  } else {
    // পেমেন্ট ফেইল বা ক্যানসেল হলে আপডেট
    return await prisma.payment.update({
      where: { transactionId: tran_id },
      data: { status: PaymentStatus.FAILED },
    });
  }
};

const getPaymentHistory = async (userId: string, role: string) => {
  if (role === 'TENANT') {
    return await prisma.payment.findMany({
      where: { rentalRequest: { tenantId: userId } },
      include: { rentalRequest: { include: { property: true } } },
    });
  }
  // ল্যান্ডলর্ড হলে তার প্রোপার্টির বিপরীতে আসা পেমেন্টগুলো দেখতে পারবে
  return await prisma.payment.findMany({
    where: { rentalRequest: { property: { landlordId: userId } } as any }, // প্রিজমা স্কিমা অনুযায়ী কোয়েরি
    include: { rentalRequest: { include: { property: true, tenant: true } } },
  });
};

const getPaymentDetails = async (id: string) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: { rentalRequest: { include: { property: true, tenant: true } } },
  });
};

export const PaymentService = {
  createPaymentSession,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
};