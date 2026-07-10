import { RentalStatus } from '@prisma/client';


//tenent rental request input
export interface ISubmitRentalInput {
  tenantId: string;
  propertyId: string;
  moveInDate: string | Date;
}

// landlord status update input
export interface IUpdateRentalStatusInput {
  id: string;
  landlordId: string;
  status: 'APPROVED' | 'REJECTED';
}