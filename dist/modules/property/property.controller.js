"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const property_service_1 = require("./property.service");
const createProperty = async (req, res, next) => {
    try {
        const user = req.user; // Auth Middleware থেকে আসা ইউজার ডেটা
        const result = await property_service_1.PropertyService.createProperty(user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllProperties = async (req, res, next) => {
    try {
        const filters = req.query;
        const result = await property_service_1.PropertyService.getAllProperties(filters);
        res.status(200).json({
            success: true,
            message: 'Properties fetched successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getPropertyById = async (req, res, next) => {
    try {
        const result = await property_service_1.PropertyService.getPropertyById(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Property not found', errorDetails: null });
        }
        res.status(200).json({
            success: true,
            message: 'Property details fetched successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateProperty = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await property_service_1.PropertyService.updateProperty(req.params.id, user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteProperty = async (req, res, next) => {
    try {
        const user = req.user;
        await property_service_1.PropertyService.deleteProperty(req.params.id, user.id);
        res.status(200).json({
            success: true,
            message: 'Property deleted successfully',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.PropertyController = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
};
