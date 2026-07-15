"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const zod_1 = require("zod");
const auth_interface_1 = require("./auth.interface");
exports.registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name cannot exceed 50 characters'),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address')
            .toLowerCase(),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password cannot exceed 100 characters'),
        phone: zod_1.z
            .string()
            .min(11, 'Phone number must be at least 11 digits')
            .max(15, 'Phone number cannot exceed 15 digits')
            .optional(),
        // 🛠️ এখানে প্রি-প্রসেস যোগ করা হয়েছে যাতে 'tenant' বা 'Tenant' দিলে সেটা 'TENANT' হয়ে যায়
        role: zod_1.z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), zod_1.z.nativeEnum(auth_interface_1.UserRole, {
            required_error: 'Role is required',
            invalid_type_error: 'Invalid role',
        }).refine((val) => val !== 'ADMIN', {
            message: 'You are not allowed to register as an ADMIN directly.',
        })),
    }),
});
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address')
            .toLowerCase(),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
