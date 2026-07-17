import { Request, Response } from "express";
import { AdminServices } from "./admin.service";



const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await AdminServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const result = await AdminServices.updateUserStatusInDB(id, status);
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllProperties = async (req: Request, res: Response) => {
  try {
    const result = await AdminServices.getAllPropertiesFromDB();
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const getAllRentalRequests = async (req: Request, res: Response) => {
  try {
    const result = await AdminServices.getAllRentalRequestsFromDB();
    res.status(200).json({
      success: true,
      message: "Rental requests fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const AdminControllers = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};