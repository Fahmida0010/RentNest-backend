import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = { searchTerm: req.query.searchTerm as string };
    const result = await CategoryService.getAllCategories(filters);
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CategoryService.getCategoryById(req.params.id);
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
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CategoryService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};