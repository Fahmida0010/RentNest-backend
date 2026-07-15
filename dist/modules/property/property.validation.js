"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyValidation = void 0;
const zod_1 = require("zod");
const createPropertyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        description: zod_1.z.string({ required_error: 'Description is required' }),
        location: zod_1.z.string({ required_error: 'Location is required' }),
        price: zod_1.z.number({ required_error: 'Price must be a number' }).positive(),
        bedrooms: zod_1.z.number({ required_error: 'Bedrooms must be an integer' }).int().nonnegative(),
        bathrooms: zod_1.z.number({ required_error: 'Bathrooms must be an integer' }).int().nonnegative(),
        amenities: zod_1.z.array(zod_1.z.string()).min(1, 'At least one amenity is required'),
        images: zod_1.z.array(zod_1.z.string()).min(1, 'At least one image is required'),
        categoryName: zod_1.z.string({ required_error: 'Category name is required' }),
    }),
});
const updatePropertyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        bedrooms: zod_1.z.number().int().nonnegative().optional(),
        bathrooms: zod_1.z.number().int().nonnegative().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        categoryName: zod_1.z.string({ required_error: "Category name is required" }),
    }),
});
exports.PropertyValidation = {
    createPropertyZodSchema,
    updatePropertyZodSchema,
};
