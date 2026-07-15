"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
const createCategory = async (req, res, next) => {
    try {
        const result = await category_service_1.CategoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllCategories = async (req, res, next) => {
    try {
        const filters = { searchTerm: req.query.searchTerm };
        const result = await category_service_1.CategoryService.getAllCategories(filters);
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getCategoryById = async (req, res, next) => {
    try {
        const result = await category_service_1.CategoryService.getCategoryById(req.params.id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
                errorDetails: `No category found with id: ${req.params.id}`,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
};
