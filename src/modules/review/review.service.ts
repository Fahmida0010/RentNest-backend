import prisma from "../../../prisma/prisma";
import { ICreateReview } from "./review.interface";

const createReviewIntoDB = async (
  tenantId: string,
  payload: ICreateReview
) => {
  //  Property exists or not
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found!");
  }


  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: "COMPLETED",
    },
  });

  if (!completedRental) {
    throw new Error(
      "You can only review a property after completing the rental!"
    );
  }

  // 3. Review create
  const result = await prisma.review.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
};