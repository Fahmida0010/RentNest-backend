"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const createReviewIntoDB = async (tenantId, payload) => {
    // 1. Property exists কিনা
    const property = await prisma_1.default.property.findUnique({
        where: {
            id: payload.propertyId,
        },
    });
    if (!property) {
        throw new Error("Property not found!");
    }
    // 2. Tenant-এর completed rental আছে কিনা
    const completedRental = await prisma_1.default.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
            status: "COMPLETED",
        },
    });
    if (!completedRental) {
        throw new Error("You can only review a property after completing the rental!");
    }
    // 3. Review create
    const result = await prisma_1.default.review.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            rating: payload.rating,
            comment: payload.comment,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                },
            },
            property: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
    return result;
};
exports.ReviewServices = {
    createReviewIntoDB,
};
