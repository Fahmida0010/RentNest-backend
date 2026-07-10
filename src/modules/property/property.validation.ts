import { z } from 'zod';

const createPropertyZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    location: z.string({ required_error: 'Location is required' }),
    price: z.number({ required_error: 'Price must be a number' }).positive(),
    bedrooms: z.number({ required_error: 'Bedrooms must be an integer' }).int().nonnegative(),
    bathrooms: z.number({ required_error: 'Bathrooms must be an integer' }).int().nonnegative(),
    amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    categoryName: z.string({ required_error: 'Category name is required' }),
  }),
});

const updatePropertyZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    price: z.number().positive().optional(),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    categoryName: z.string({ required_error: "Category name is required" }),
  }),
});

export const PropertyValidation = {
  createPropertyZodSchema,
  updatePropertyZodSchema,
};