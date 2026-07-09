import express from 'express';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validate';


const router = express.Router();

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

// Admin only routes
router.post(
  '/',
   auth('ADMIN'),
 validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.put(
  '/:id',
  auth('ADMIN'),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
   auth('ADMIN'),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;