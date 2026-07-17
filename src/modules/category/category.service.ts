import { Category } from "@prisma/client";
import prisma from "../../../prisma/prisma";

const createCategory = async (payload: { name: string }): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async (filters: { searchTerm?: string }): Promise<any[]> => { 
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
        select: { properties: true } 
      }
    }
  });

  return result;
};

const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      properties: true, 
    },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
};