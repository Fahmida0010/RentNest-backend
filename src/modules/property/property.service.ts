import { IPropertyFilterRequest } from './property.interface';
import prisma from '../../../prisma/prisma';
import { Property, PropertyStatus } from '@prisma/client';


const createProperty = async (landlordId: string, payload: any): Promise<Property> => {
  const { categoryName, ...propertyData } = payload;

 const category = await prisma.category.findFirst({
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

  
  const result = await prisma.property.create({
    data: {
      ...propertyData,
      landlordId,
      categoryId: category.id,
    },
    include: { category: true },
  });
  
  return result;
};


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
    include: { 
      category: true, 
      landlord: { select: { name: true, email: true, phone: true } }, 
      reviews: true 
    },
  });
};




const updateProperty = async (id: string, landlordId: string, payload: Partial<Property>): Promise<Property> => {
  // চেক করা হচ্ছে প্রোপার্টিটি এই ল্যান্ডলর্ডের কিনা
  // ৯২ এবং ৯৩ নম্বর লাইন (আপনার কোড)
const isOwner = await prisma.property.findFirst({ where: { id, landlordId } });
if (!isOwner) throw new Error('Unauthorized or Property not found');

// 🔍 ১. প্রথমে categoryName দিয়ে ক্যাটাগরি অবজেক্টটি খুঁজে বের করুন (Exact Match)
const category = await prisma.category.findFirst({
  where: {
    name: {
      equals: payload.categoryName, 
      mode: 'insensitive'
    }
  }
});

if (!category) {
  throw new Error(`Category '${payload.categoryName}' not found!`);
}


return await prisma.property.update({
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


const deleteProperty = async (id: string, landlordId: string): Promise<Property> => {
  const isOwner = await prisma.property.findFirst({ where: { id, landlordId } });
  if (!isOwner) throw new Error('Unauthorized or Property not found');

  return await prisma.property.delete({ where: { id } });
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
