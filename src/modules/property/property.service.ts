import { IPropertyFilterRequest } from './property.interface';
import prisma from '../../../prisma/prisma';
import { Property, PropertyStatus } from '@prisma/client';



// ১. প্রোপার্টি তৈরি করা (Landlord)
const createProperty = async (landlordId: string, payload: Property): Promise<Property> => {
  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: { category: true },
  });
  return result;
};

// ২. ফিল্টার ও সার্চসহ সব প্রোপার্টি দেখা (Public)
const getAllProperties = async (filters: IPropertyFilterRequest): Promise<Property[]> => {
  const { searchTerm, location, categoryId, minPrice, maxPrice } = filters;
  const andConditions: any[] = [{ status: PropertyStatus.AVAILABLE }]; 

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

  return await prisma.property.findMany({
    where: whereConditions,
    include: { category: true, reviews: true },
    orderBy: { createdAt: 'desc' },
  });
};

// ৩. নির্দিষ্ট প্রোপার্টির ডিটেইলস (Public)
const getPropertyById = async (id: string): Promise<Property | null> => {
  return await prisma.property.findUnique({
    where: { id },
    include: { category: true, landlord: { select: { name: true, email: true, phone: true } }, reviews: true },
  });
};

// ৪. প্রোপার্টি আপডেট করা (Landlord)
const updateProperty = async (id: string, landlordId: string, payload: Partial<Property>): Promise<Property> => {
  // চেক করা হচ্ছে প্রোপার্টিটি এই ল্যান্ডলর্ডের কিনা
  const isOwner = await prisma.property.findFirst({ where: { id, landlordId } });
  if (!isOwner) throw new Error('Unauthorized or Property not found');

  return await prisma.property.update({
    where: { id },
    data: payload,
  });
};

// ৫. প্রোপার্টি ডিলিট করা (Landlord)
const deleteProperty = async (id: string, landlordId: string): Promise<Property> => {
  const isOwner = await prisma.property.findFirst({ where: { id, landlordId } });
  if (!isOwner) throw new Error('Unauthorized or Property not found');

  return await prisma.property.delete({ where: { id } });
};

// ৬. সব ক্যাটাগরি দেখা (Public)
const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllCategories,
};