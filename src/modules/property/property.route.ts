import express from 'express';
import { PropertyController } from './property.controller';
import { PropertyValidation } from './property.validation';
import validateRequest from '../../middleware/validate'; 
import auth from '../../middleware/auth';

const router = express.Router();


//  Public Routes 
router.get('/properties', PropertyController.getAllProperties);
router.get('/properties/:id', PropertyController.getPropertyById);


// Create Property Listing
router.post(
  '/landlord/properties',
  auth('LANDLORD'), 
  validateRequest(PropertyValidation.createPropertyZodSchema),
  PropertyController.createProperty
);

// Update Property Listing
router.put(
  '/landlord/properties/:id',
  auth('LANDLORD'),
  validateRequest(PropertyValidation.updatePropertyZodSchema),
  PropertyController.updateProperty
);

// Remove Property Listing
router.delete(
  '/landlord/properties/:id',
  auth('LANDLORD'),
  PropertyController.deleteProperty
);

export const PropertyRoutes = router;