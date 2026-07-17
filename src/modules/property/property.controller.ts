import { Request, Response, NextFunction } from 'express';
import { PropertyService } from './property.service';

const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user; 
    const result = await PropertyService.createProperty(user.id, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const result = await PropertyService.getAllProperties(filters);

    res.status(200).json({
      success: true,
      message: 'Properties fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PropertyService.getPropertyById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Property not found', errorDetails: null });
    }

    res.status(200).json({
      success: true,
      message: 'Property details fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await PropertyService.updateProperty(req.params.id, user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    await PropertyService.deleteProperty(req.params.id, user.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};


export const PropertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};