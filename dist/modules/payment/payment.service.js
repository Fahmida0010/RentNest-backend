"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const client_1 = require("@prisma/client");
const store_id = process.env.STORE_ID;
const store_password = process.env.STORE_PASSWORD;
const is_live = process.env.IS_LIVE === "true";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const createPaymentSession = async (rentalRequestId, userId) => {
    // Find rental request
    const rentalRequest = await prisma_1.default.rentalRequest.findUnique({
        where: {
            id: rentalRequestId,
        },
        include: {
            property: true,
            payment: true,
            tenant: true,
        },
    });
    if (!rentalRequest) {
        throw new Error("Rental Request not found");
    }
    // Check tenant ownership
    if (rentalRequest.tenantId !== userId) {
        throw new Error("You are not authorized to pay for this rental request");
    }
    // Only approved rental request can be paid
    if (rentalRequest.status !== "APPROVED") {
        throw new Error(`Payment is not allowed for ${rentalRequest.status} rental request`);
    }
    // Already successfully paid
    if (rentalRequest.payment?.status ===
        client_1.PaymentStatus.SUCCESS) {
        throw new Error("Payment has already been completed for this rental request");
    }
    // Pending payment already exists
    if (rentalRequest.payment?.status ===
        client_1.PaymentStatus.PENDING) {
        throw new Error("A pending payment already exists for this rental request");
    }
    const transactionId = `TXN-${Date.now()}-${userId.slice(0, 5)}`;
    const amount = rentalRequest.property.price;
    // Failed payment থাকলে update
    if (rentalRequest.payment?.status ===
        client_1.PaymentStatus.FAILED) {
        await prisma_1.default.payment.update({
            where: {
                rentalRequestId,
            },
            data: {
                transactionId,
                amount,
                status: client_1.PaymentStatus.PENDING,
                paidAt: null,
            },
        });
    }
    else {
        // Create payment
        await prisma_1.default.payment.create({
            data: {
                rentalRequestId,
                amount,
                transactionId,
                provider: client_1.PaymentProvider.SSLCOMMERZ,
                status: client_1.PaymentStatus.PENDING,
            },
        });
    }
    const data = {
        total_amount: amount,
        currency: "BDT",
        tran_id: transactionId,
        success_url: `${BACKEND_URL}/api/payments/confirm?status=SUCCESS&tran_id=${transactionId}`,
        fail_url: `${BACKEND_URL}/api/payments/confirm?status=FAILED&tran_id=${transactionId}`,
        cancel_url: `${BACKEND_URL}/api/payments/confirm?status=CANCELLED&tran_id=${transactionId}`,
        ipn_url: `${BACKEND_URL}/api/payments/confirm`,
        shipping_method: "NO",
        product_name: rentalRequest.property.title,
        product_category: "Property Rental",
        product_profile: "general",
        cus_name: rentalRequest.tenant.name,
        cus_email: rentalRequest.tenant.email,
        cus_add1: "Bangladesh",
        cus_add2: "Bangladesh",
        cus_city: "Sylhet",
        cus_state: "Sylhet",
        cus_postcode: "3100",
        cus_country: "Bangladesh",
        cus_phone: "01700000000",
        ship_name: rentalRequest.tenant.name,
        ship_add1: "Bangladesh",
        ship_add2: "Bangladesh",
        ship_city: "Sylhet",
        ship_state: "Sylhet",
        ship_postcode: "3100",
        ship_country: "Bangladesh",
    };
    const sslcz = new sslcommerz_lts_1.default(store_id, store_password, is_live);
    const apiResponse = await sslcz.init(data);
    if (!apiResponse?.GatewayPageURL) {
        throw new Error("Payment session creation failed");
    }
    return {
        paymentUrl: apiResponse.GatewayPageURL,
        transactionId,
    };
};
const confirmPayment = async (tran_id, status) => {
    const payment = await prisma_1.default.payment.findUnique({
        where: {
            transactionId: tran_id,
        },
    });
    if (!payment) {
        throw new Error("Payment not found");
    }
    if (status === "SUCCESS" || status === "VALID") {
        return await prisma_1.default.$transaction(async (tx) => {
            // Payment success
            const updatedPayment = await tx.payment.update({
                where: {
                    transactionId: tran_id,
                },
                data: {
                    status: client_1.PaymentStatus.SUCCESS,
                    paidAt: new Date(),
                },
            });
            // Rental request active
            await tx.rentalRequest.update({
                where: {
                    id: payment.rentalRequestId,
                },
                data: {
                    status: "COMPLETED",
                },
            });
            return updatedPayment;
        });
    }
    // Payment failed
    return await prisma_1.default.payment.update({
        where: {
            transactionId: tran_id,
        },
        data: {
            status: client_1.PaymentStatus.FAILED,
            paidAt: null,
        },
    });
};
const getPaymentHistory = async (userId, role) => {
    if (role === "TENANT") {
        return await prisma_1.default.payment.findMany({
            where: {
                rentalRequest: {
                    tenantId: userId,
                },
            },
            include: {
                rentalRequest: {
                    include: {
                        property: true,
                    },
                },
            },
            orderBy: {
                paidAt: "desc",
            },
        });
    }
    return await prisma_1.default.payment.findMany({
        where: {
            rentalRequest: {
                property: {
                    landlordId: userId,
                },
            },
        },
        include: {
            rentalRequest: {
                include: {
                    property: true,
                    tenant: true,
                },
            },
        },
        orderBy: {
            paidAt: "desc",
        },
    });
};
const getPaymentDetails = async (id) => {
    const payment = await prisma_1.default.payment.findUnique({
        where: {
            id,
        },
        include: {
            rentalRequest: {
                include: {
                    property: true,
                    tenant: true,
                },
            },
        },
    });
    if (!payment) {
        throw new Error("Payment not found");
    }
    return payment;
};
exports.PaymentService = {
    createPaymentSession,
    confirmPayment,
    getPaymentHistory,
    getPaymentDetails,
};
