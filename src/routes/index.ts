import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PropertyRoutes } from "../modules/property/property.route";
import { CategoryRoutes } from "../modules/category/category.route";

const router = Router();

router.use("/auth", AuthRoutes);


router.use("/api", PropertyRoutes);


router.use("/api/categories", CategoryRoutes);

export default router;