"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Category name is required',
        }).min(1, 'Category name cannot be empty'),
    }),
});
const updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Category name is required',
        }).min(1, 'Category name cannot be empty'),
    }),
});
exports.CategoryValidation = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
