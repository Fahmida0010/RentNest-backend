"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const createCategory = async (payload) => {
    const result = await prisma_1.default.category.create({
        data: payload,
    });
    return result;
};
// ১. এখানে আমরা কাউন্ট যোগ করেছি
const getAllCategories = async (filters) => {
    // Note: Return type Promise<Category[]> থেকে Promise<any[]> করা হয়েছে কারণ এতে '_count' অবজেক্টটি যুক্ত হবে
    const { searchTerm } = filters;
    const result = await prisma_1.default.category.findMany({
        where: searchTerm
            ? {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            }
            : {},
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: { properties: true } // প্রপার্টির সংখ্যা গুনবে
            }
        }
    });
    return result;
};
const getCategoryById = async (id) => {
    const result = await prisma_1.default.category.findUnique({
        where: { id },
        include: {
            properties: true, // এটি পুরো প্রপার্টির লিস্টসহ নিয়ে আসবে (কাউন্টসহ আলাদা করে চাইলে এখানেও _count দেওয়া যায়)
        },
    });
    return result;
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
};
