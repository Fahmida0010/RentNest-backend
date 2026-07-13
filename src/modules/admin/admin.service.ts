import { UserStatus } from "@prisma/client";
import prisma from "../../../prisma/prisma";


// ১. প্ল্যাটফর্মের সকল ইউজারদের গেট করা (Tenant ও Landlord)
const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: {
        in: ["TENANT", "LANDLORD"], // এডমিন নিজের ডাটা বাদে বাকিদের দেখবে
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

// ২. ইউজারের স্ট্যাটাস পরিবর্তন করা (Ban / Unban)
const updateUserStatusInDB = async (userId: string, status: UserStatus) => {
  // ইউজার আসলেই এক্সিস্ট করে কিনা চেক করা
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

// ৩. প্ল্যাটফর্মের সকল প্রপার্টি লিস্টিং দেখা
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

// ৪. প্ল্যাটফর্মের সকল রেন্টাল রিকোয়েস্ট এবং তাদের পেমেন্ট স্ট্যাটাস দেখা
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
      payment: true, // পেমেন্ট ইনফরমেশন যুক্ত করা হলো
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