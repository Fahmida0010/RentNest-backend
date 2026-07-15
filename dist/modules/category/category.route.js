"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validate_1 = __importDefault(require("../../middleware/validate"));
const router = express_1.default.Router();
// Public routes
router.get('/', category_controller_1.CategoryController.getAllCategories);
router.get('/:id', category_controller_1.CategoryController.getCategoryById);
// Admin only routes
router.post('/', (0, auth_1.default)('ADMIN'), (0, validate_1.default)(category_validation_1.CategoryValidation.createCategoryValidationSchema), category_controller_1.CategoryController.createCategory);
exports.CategoryRoutes = router;
