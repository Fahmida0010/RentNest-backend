import { z } from 'zod';
import { UserRole } from './auth.interface';

export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address')
      .toLowerCase(),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),

    phone: z
      .string()
      .min(11, 'Phone number must be at least 11 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .optional(),

    // 🛠️ এখানে প্রি-প্রসেস যোগ করা হয়েছে যাতে 'tenant' বা 'Tenant' দিলে সেটা 'TENANT' হয়ে যায়
    role: z.preprocess(
      (val) => (typeof val === 'string' ? val.toUpperCase() : val),
      z.nativeEnum(UserRole, {
        required_error: 'Role is required',
        invalid_type_error: 'Invalid role',
      }).refine((val) => val !== 'ADMIN', {
        message: 'You are not allowed to register as an ADMIN directly.',
      })
    ),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address')
      .toLowerCase(),

    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export type RegisterInput = z.infer<typeof registerValidationSchema>['body'];
export type LoginInput = z.infer<typeof loginValidationSchema>['body'];
