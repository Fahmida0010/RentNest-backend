"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const register = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.register(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        data: result,
    });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Login successful",
        data: result,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.getMe(req.user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: result,
    });
});
exports.AuthController = {
    register,
    login,
    getMe,
};
