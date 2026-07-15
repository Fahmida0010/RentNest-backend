"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const auth_validate_1 = require("./auth.validate");
const validate_1 = __importDefault(require("../../middleware/validate"));
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.default)(auth_validate_1.registerValidationSchema), auth_controller_1.AuthController.register);
router.post("/login", (0, validate_1.default)(auth_validate_1.loginValidationSchema), auth_controller_1.AuthController.login);
router.get("/me", (0, auth_1.default)(), auth_controller_1.AuthController.getMe);
exports.AuthRoutes = router;
