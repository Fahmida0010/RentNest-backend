"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminControllers = void 0;
const admin_service_1 = require("./admin.service");
// ১. সব ইউজারদের লিস্ট আনা
const getAllUsers = async (req, res) => {
    try {
        const result = await admin_service_1.AdminServices.getAllUsersFromDB();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
// ২. ইউজারের স্ট্যাটাস পরিবর্তন করা
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'ACTIVE' বা 'BLOCKED'
        const result = await admin_service_1.AdminServices.updateUserStatusInDB(id, status);
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
// ৩. সব প্রপার্টি লিস্টিং আনা
const getAllProperties = async (req, res) => {
    try {
        const result = await admin_service_1.AdminServices.getAllPropertiesFromDB();
        res.status(200).json({
            success: true,
            message: "Properties fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
// ৪. সব রেন্টাল রিকোয়েস্ট আনা
const getAllRentalRequests = async (req, res) => {
    try {
        const result = await admin_service_1.AdminServices.getAllRentalRequestsFromDB();
        res.status(200).json({
            success: true,
            message: "Rental requests fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
exports.AdminControllers = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests,
};
