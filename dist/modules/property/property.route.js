"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("./property.controller");
const property_validation_1 = require("./property.validation");
const validate_1 = __importDefault(require("../../middleware/validate"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
// 1. Public Routes 
router.get('/properties', property_controller_1.PropertyController.getAllProperties);
router.get('/properties/:id', property_controller_1.PropertyController.getPropertyById);
// 2. Landlord Protected Routes 
// Create Property Listing
router.post('/landlord/properties', (0, auth_1.default)('LANDLORD'), (0, validate_1.default)(property_validation_1.PropertyValidation.createPropertyZodSchema), property_controller_1.PropertyController.createProperty);
// Update Property Listing
router.put('/landlord/properties/:id', (0, auth_1.default)('LANDLORD'), (0, validate_1.default)(property_validation_1.PropertyValidation.updatePropertyZodSchema), property_controller_1.PropertyController.updateProperty);
// Remove Property Listing
router.delete('/landlord/properties/:id', (0, auth_1.default)('LANDLORD'), property_controller_1.PropertyController.deleteProperty);
exports.PropertyRoutes = router;
