import { Router } from 'express';
import auth from '../../middleware/auth';
import { RentalController } from './rental.controller';



const router = Router();

// Tenant Routes
router.post('/rentals', auth('TENANT'), RentalController.submitRequest);
router.get('/rentals', auth('TENANT'), RentalController.getTenantRequests);
router.get('/rentals/:id', auth(),RentalController.getRequestById);

// Landlord Routes
router.get('/landlord/requests', auth('LANDLORD'), RentalController.getLandlordRequests);
router.patch('/landlord/requests/:id', auth('LANDLORD'), RentalController.updateRequestStatus);

export const RentalRoutes = router;

