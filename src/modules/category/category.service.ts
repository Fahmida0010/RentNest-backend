import { Category } from "@prisma/client";
import prisma from "../../../prisma/prisma";



const createCategory = async (payload: { name: string }): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async (filters: { searchTerm?: string }): Promise<Category[]> => {
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
  });

  return result;
};

const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      properties: true, // ক্যাটাগরির সাথে প্রোপার্টিজ লিংক দেখার জন্য
    },
  });
  return result;
};

const updateCategory = async (id: string, payload: { name: string }): Promise<Category> => {
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCategory = async (id: string): Promise<Category> => {
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};