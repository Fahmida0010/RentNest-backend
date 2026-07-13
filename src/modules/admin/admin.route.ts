import { Router } from "express";
import auth from "../../middleware/auth";
import { AdminControllers } from "./admin.controller";

const router = Router();

// ১. সকল ইউজার দেখার রুট
router.get("/users", auth("ADMIN"), AdminControllers.getAllUsers);

// ২. ইউজারের স্ট্যাটাস (Ban/Unban) পরিবর্তনের রুট
router.patch("/users/:id", auth("ADMIN"), AdminControllers.updateUserStatus);

// ৩. সকল প্রপার্টি দেখার রুট
router.get("/properties", auth("ADMIN"), AdminControllers.getAllProperties);

// ৪. সকল রেন্টাল রিকোয়েস্ট দেখার রুট
router.get("/rentals", auth("ADMIN"), AdminControllers.getAllRentalRequests);

export const AdminRoutes = router;