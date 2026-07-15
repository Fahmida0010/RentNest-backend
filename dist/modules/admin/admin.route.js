"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// ১. সকল ইউজার দেখার রুট
router.get("/users", (0, auth_1.default)("ADMIN"), admin_controller_1.AdminControllers.getAllUsers);
// ২. ইউজারের স্ট্যাটাস (Ban/Unban) পরিবর্তনের রুট
router.patch("/users/:id", (0, auth_1.default)("ADMIN"), admin_controller_1.AdminControllers.updateUserStatus);
// ৩. সকল প্রপার্টি দেখার রুট
router.get("/properties", (0, auth_1.default)("ADMIN"), admin_controller_1.AdminControllers.getAllProperties);
// ৪. সকল রেন্টাল রিকোয়েস্ট দেখার রুট
router.get("/rentals", (0, auth_1.default)("ADMIN"), admin_controller_1.AdminControllers.getAllRentalRequests);
exports.AdminRoutes = router;
