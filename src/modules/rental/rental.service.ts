import { ISubmitRentalInput } from './rental.interface';
import prisma from '../../../prisma/prisma';




export class RentalService {
  // Submit rental request
  static async submitRequest(data: ISubmitRentalInput) {
    // Check if property exists and is AVAILABLE
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) throw new Error('Property not found');
    if (property.status !== 'AVAILABLE') throw new Error('Property is not available for rent');

    // Check if user already has a pending request for this property
    const existingRequest = await prisma.rentalRequest.findFirst({
      where: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        status: 'PENDING',
      },
    });

    if (existingRequest) throw new Error('You already have a pending request for this property');

    return await prisma.rentalRequest.create({
      data: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        moveInDate: new Date(data.moveInDate),
      },
      include: { property: true },
    });
  }

  // Get tenant's own requests
  static async getTenantRequests(tenantId: string) {
    return await prisma.rentalRequest.findMany({
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
  static async getRequestById(id: string, userId: string, userRole: string) {
    const request = await prisma.rentalRequest.findUnique({
      where: { id },
      include: {
        property: true,
        tenant: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!request) throw new Error('Rental request not found');

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
  static async getLandlordRequests(landlordId: string) {
    return await prisma.rentalRequest.findMany({
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
  static async updateRequestStatus(id: string, landlordId: string, status: 'APPROVED' | 'REJECTED') {
    const request = await prisma.rentalRequest.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!request) throw new Error('Rental request not found');
    if (request.property.landlordId !== landlordId) throw new Error('Unauthorized: You do not own this property');
    if (request.status !== 'PENDING') throw new Error(`Request is already ${request.status.toLowerCase()}`);

    // Using Transaction to update request status and update property status if approved
    return await prisma.$transaction(async (tx) => {
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