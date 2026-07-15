"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
const prisma_1 = __importDefault(require("../../../prisma/prisma"));
const register = async (payload) => {
    const isUserExist = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExist) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, bcrypt_1.hashPassword)(payload.password);
    const user = await prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            phone: payload.phone,
            role: payload.role.toUpperCase(),
        },
    });
    const accessToken = (0, jwt_1.generateToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES_IN);
    const { password, ...userWithoutPassword } = user;
    return {
        accessToken,
        user: userWithoutPassword,
    };
};
const login = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const matched = await (0, bcrypt_1.comparePassword)(payload.password, user.password);
    if (!matched) {
        throw new Error("Invalid email or password");
    }
    if (user.status === "BLOCKED") {
        throw new Error("Your account has been blocked. Please contact admin.");
    }
    const accessToken = (0, jwt_1.generateToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES_IN);
    const { password, ...userWithoutPassword } = user;
    return {
        accessToken,
        user: userWithoutPassword,
    };
};
const getMe = async (id) => {
    return await prisma_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
    });
};
exports.AuthService = {
    register,
    login,
    getMe,
};
