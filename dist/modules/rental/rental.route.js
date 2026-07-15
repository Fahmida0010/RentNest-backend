"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const rental_controller_1 = require("./rental.controller");
const router = (0, express_1.Router)();
// Tenant Routes
router.post('/rentals', (0, auth_1.default)('TENANT'), rental_controller_1.RentalController.submitRequest);
router.get('/rentals', (0, auth_1.default)('TENANT'), rental_controller_1.RentalController.getTenantRequests);
router.get('/rentals/:id', (0, auth_1.default)(), rental_controller_1.RentalController.getRequestById);
// Landlord Routes
router.get('/landlord/requests', (0, auth_1.default)('LANDLORD'), rental_controller_1.RentalController.getLandlordRequests);
router.patch('/landlord/requests/:id', (0, auth_1.default)('LANDLORD'), rental_controller_1.RentalController.updateRequestStatus);
exports.RentalRoutes = router;
