"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const client_1 = require("@prisma/client"); // 🛠️ ফিক্স: 'prisma' এর বদলে 'Prisma' হবে (বড় হাতের P)
const globalError = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails = err;
    // 🛠️ জড এরর হ্যান্ডলিং ফিক্স (যাতে অরিজিনাল মেসেজ দেখায়)
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errorDetails = err.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1],
            message: issue.message, // 👈 আপনার সেট করা 'You are not allowed...' মেসেজটি এখানে আসবে
        }));
    }
    // 🛠️ প্রিজমা এরর চেক ফিক্স
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;
        message = err.message;
        errorDetails = err.meta;
    }
    else if (err instanceof Error) {
        statusCode = 400;
        message = err.message;
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
exports.default = globalError;
