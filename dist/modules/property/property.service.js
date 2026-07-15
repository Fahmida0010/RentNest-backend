"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const client_1 = require("@prisma/client");
const createProperty = async (landlordId, payload) => {
    const { categoryName, ...propertyData } = payload;
    const category = await prisma_1.default.category.findFirst({
        where: {
            name: {
                equals: categoryName.trim(),
                mode: 'insensitive',
            },
        },
    });
    // ❌ ক্যাটাগরি না পাওয়া গেলে এরর থ্রো করা
    if (!category) {
        throw new Error(`Category '${categoryName}' not found! Please ensure the category exists.`);
    }
    // 📝 ক্যাটাগরি আইডিসহ প্রোপার্টি তৈরি করা
    const result = await prisma_1.default.property.create({
        data: {
            ...propertyData,
            landlordId,
            categoryId: category.id,
        },
        include: { category: true },
    });
    return result;
};
// ২. ফিল্টার ও সার্চসহ সব প্রোপার্টি দেখা (Public)
const getAllProperties = async (filters) => {
    const { searchTerm, location, categoryId, minPrice, maxPrice } = filters;
    const andConditions = [{ status: client_1.PropertyStatus.AVAILABLE }];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { location: { contains: searchTerm, mode: 'insensitive' } },
            ],
        });
    }
    if (location) {
        andConditions.push({ location: { contains: location, mode: 'insensitive' } });
    }
    if (categoryId) {
        andConditions.push({ categoryId });
    }
    if (minPrice || maxPrice) {
        andConditions.push({
            price: {
                gte: minPrice ? parseFloat(minPrice) : undefined,
                lte: maxPrice ? parseFloat(maxPrice) : undefined,
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    return await prisma_1.default.property.findMany({
        where: whereConditions,
        include: { category: true, reviews: true },
        orderBy: { createdAt: 'desc' },
    });
};
// ৩. নির্দিষ্ট প্রোপার্টির ডিটেইলস (Public)
const getPropertyById = async (id) => {
    return await prisma_1.default.property.findUnique({
        where: { id },
        include: {
            category: true,
            landlord: { select: { name: true, email: true, phone: true } },
            reviews: true
        },
    });
};
// ৪. প্রোপার্টি আপডেট করা (Landlord)
const updateProperty = async (id, landlordId, payload) => {
    // চেক করা হচ্ছে প্রোপার্টিটি এই ল্যান্ডলর্ডের কিনা
    // ৯২ এবং ৯৩ নম্বর লাইন (আপনার কোড)
    const isOwner = await prisma_1.default.property.findFirst({ where: { id, landlordId } });
    if (!isOwner)
        throw new Error('Unauthorized or Property not found');
    // 🔍 ১. প্রথমে categoryName দিয়ে ক্যাটাগরি অবজেক্টটি খুঁজে বের করুন (Exact Match)
    const category = await prisma_1.default.category.findFirst({
        where: {
            name: {
                equals: payload.categoryName, // "Villa"
                mode: 'insensitive'
            }
        }
    });
    if (!category) {
        throw new Error(`Category '${payload.categoryName}' not found!`);
    }
    // 🚀 ২. এখন প্রপার্টি আপডেট করুন
    return await prisma_1.default.property.update({
        where: { id },
        data: {
            title: payload.title,
            description: payload.description,
            location: payload.location,
            price: payload.price,
            bedrooms: payload.bedrooms,
            bathrooms: payload.bathrooms,
            amenities: payload.amenities,
            images: payload.images,
            categoryId: category.id
        },
    });
};
// ৫. প্রোপার্টি ডিলিট করা (Landlord)
const deleteProperty = async (id, landlordId) => {
    const isOwner = await prisma_1.default.property.findFirst({ where: { id, landlordId } });
    if (!isOwner)
        throw new Error('Unauthorized or Property not found');
    return await prisma_1.default.property.delete({ where: { id } });
};
exports.PropertyService = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
};
