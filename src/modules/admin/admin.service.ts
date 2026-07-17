import { UserStatus } from "@prisma/client";
import prisma from "../../../prisma/prisma";



const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: {
        in: ["TENANT", "LANDLORD"], 
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  return result;
};


const updateUserStatusInDB = async (userId: string, status: UserStatus) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User not found!");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return result;
};


const getAllPropertiesFromDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });
  return result;
};


const getAllRentalRequestsFromDB = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
        },
      },
      payment: true, 
    },
  });
  return result;
};

export const AdminServices = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllPropertiesFromDB,
  getAllRentalRequestsFromDB,
};