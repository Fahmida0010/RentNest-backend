import { Request, Response } from 'express';
import { RentalService } from './rental.service';


export class RentalController {
  // Submit a rental request (Tenant)
  static async submitRequest(req: Request, res: Response) {
    try {
      const tenantId = req.user.id; // From auth middleware
      const { propertyId, moveInDate } = req.body;

      const result = await RentalService.submitRequest({ tenantId, propertyId, moveInDate });
      res.status(201).json({ success: true, message: 'Rental request submitted successfully', data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get all rental requests for a specific tenant
  static async getTenantRequests(req: Request, res: Response) {
    try {
      const tenantId = req.user.id;
      const result = await RentalService.getTenantRequests(tenantId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get single rental request details (Both Tenant & Landlord)
  static async getRequestById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const result = await RentalService.getRequestById(id, userId, userRole);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get all rental requests for landlord's properties
  static async getLandlordRequests(req: Request, res: Response) {
    try {
      const landlordId = req.user.id;
      const result = await RentalService.getLandlordRequests(landlordId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Approve or reject a rental request (Landlord)
  static async updateRequestStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const landlordId = req.user.id;
      const { status } = req.body; // APPROVED or REJECTED

      if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status. Use APPROVED or REJECTED' });
      }

      const result = await RentalService.updateRequestStatus(id, landlordId, status);
      res.status(200).json({ success: true, message: `Rental request ${status.toLowerCase()} successfully`, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}