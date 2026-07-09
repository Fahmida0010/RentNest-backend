import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
import { loginValidationSchema, registerValidationSchema } from "./auth.validate";
import validateRequest from "../../middleware/validate";


const router = Router();

router.post("/register",validateRequest(registerValidationSchema), AuthController.register);
router.post("/login", validateRequest(loginValidationSchema), AuthController.login);
router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;
