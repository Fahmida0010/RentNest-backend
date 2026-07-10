import { Category } from "@prisma/client";
import prisma from "../../../prisma/prisma";

const createCategory = async (payload: { name: string }): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

// ১. এখানে আমরা কাউন্ট যোগ করেছি
const getAllCategories = async (filters: { searchTerm?: string }): Promise<any[]> => { 
  // Note: Return type Promise<Category[]> থেকে Promise<any[]> করা হয়েছে কারণ এতে '_count' অবজেক্টটি যুক্ত হবে
  const { searchTerm } = filters;

  const result = await prisma.category.findMany({
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

const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      properties: true, // এটি পুরো প্রপার্টির লিস্টসহ নিয়ে আসবে (কাউন্টসহ আলাদা করে চাইলে এখানেও _count দেওয়া যায়)
    },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
};