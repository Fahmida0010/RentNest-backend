"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = void 0;
const rental_service_1 = require("./rental.service");
class RentalController {
    // Submit a rental request (Tenant)
    static async submitRequest(req, res) {
        try {
            const tenantId = req.user.id; // From auth middleware
            const { propertyId, moveInDate } = req.body;
            const result = await rental_service_1.RentalService.submitRequest({ tenantId, propertyId, moveInDate });
            res.status(201).json({ success: true, message: 'Rental request submitted successfully', data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    // Get all rental requests for a specific tenant
    static async getTenantRequests(req, res) {
        try {
            const tenantId = req.user.id;
            const result = await rental_service_1.RentalService.getTenantRequests(tenantId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    // Get single rental request details (Both Tenant & Landlord)
    static async getRequestById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            const result = await rental_service_1.RentalService.getRequestById(id, userId, userRole);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    // Get all rental requests for landlord's properties
    static async getLandlordRequests(req, res) {
        try {
            const landlordId = req.user.id;
            const result = await rental_service_1.RentalService.getLandlordRequests(landlordId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    // Approve or reject a rental request (Landlord)
    static async updateRequestStatus(req, res) {
        try {
            const { id } = req.params;
            const landlordId = req.user.id;
            const { status } = req.body; // APPROVED or REJECTED
            if (!['APPROVED', 'REJECTED'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status. Use APPROVED or REJECTED' });
            }
            const result = await rental_service_1.RentalService.updateRequestStatus(id, landlordId, status);
            res.status(200).json({ success: true, message: `Rental request ${status.toLowerCase()} successfully`, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
exports.RentalController = RentalController;
