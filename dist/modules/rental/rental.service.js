"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalService = void 0;
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
// const prisma = new PrismaClient();
class RentalService {
    // Submit rental request
    static async submitRequest(data) {
        // Check if property exists and is AVAILABLE
        const property = await prisma_1.default.property.findUnique({
            where: { id: data.propertyId },
        });
        if (!property)
            throw new Error('Property not found');
        if (property.status !== 'AVAILABLE')
            throw new Error('Property is not available for rent');
        // Check if user already has a pending request for this property
        const existingRequest = await prisma_1.default.rentalRequest.findFirst({
            where: {
                tenantId: data.tenantId,
                propertyId: data.propertyId,
                status: 'PENDING',
            },
        });
        if (existingRequest)
            throw new Error('You already have a pending request for this property');
        return await prisma_1.default.rentalRequest.create({
            data: {
                tenantId: data.tenantId,
                propertyId: data.propertyId,
                moveInDate: new Date(data.moveInDate),
            },
            include: { property: true },
        });
    }
    // Get tenant's own requests
    static async getTenantRequests(tenantId) {
        return await prisma_1.default.rentalRequest.findMany({
            where: { tenantId },
            include: {
                property: {
                    select: { title: true, location: true, price: true, images: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Get specific request details
    static async getRequestById(id, userId, userRole) {
        const request = await prisma_1.default.rentalRequest.findUnique({
            where: { id },
            include: {
                property: true,
                tenant: { select: { name: true, email: true, phone: true } },
            },
        });
        if (!request)
            throw new Error('Rental request not found');
        // Authorization check
        if (userRole === 'TENANT' && request.tenantId !== userId) {
            throw new Error('Unauthorized access');
        }
        if (userRole === 'LANDLORD' && request.property.landlordId !== userId) {
            throw new Error('Unauthorized access');
        }
        return request;
    }
    // Get landlord's received requests
    static async getLandlordRequests(landlordId) {
        return await prisma_1.default.rentalRequest.findMany({
            where: {
                property: { landlordId },
            },
            include: {
                property: { select: { title: true, price: true, location: true } },
                tenant: { select: { name: true, email: true, phone: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Approve or Reject request
    static async updateRequestStatus(id, landlordId, status) {
        const request = await prisma_1.default.rentalRequest.findUnique({
            where: { id },
            include: { property: true },
        });
        if (!request)
            throw new Error('Rental request not found');
        if (request.property.landlordId !== landlordId)
            throw new Error('Unauthorized: You do not own this property');
        if (request.status !== 'PENDING')
            throw new Error(`Request is already ${request.status.toLowerCase()}`);
        // Using Transaction to update request status and update property status if approved
        return await prisma_1.default.$transaction(async (tx) => {
            const updatedRequest = await tx.rentalRequest.update({
                where: { id },
                data: { status },
            });
            // If approved, update property status to RENTED (or handle based on your logic)
            if (status === 'APPROVED') {
                await tx.property.update({
                    where: { id: request.propertyId },
                    data: { status: 'RENTED' },
                });
                // Optional: Reject all other pending requests for this property
                await tx.rentalRequest.updateMany({
                    where: {
                        propertyId: request.propertyId,
                        id: { not: id },
                        status: 'PENDING',
                    },
                    data: { status: 'REJECTED' },
                });
            }
            return updatedRequest;
        });
    }
}
exports.RentalService = RentalService;
