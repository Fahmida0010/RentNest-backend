import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PropertyRoutes } from "../modules/property/property.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { RentalRoutes } from "../modules/rental/rental.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/", PropertyRoutes);

router.use("/categories", CategoryRoutes);

router.use("/", RentalRoutes);

router.use("/payments", PaymentRoutes);

router.use("/api/admin", AdminRoutes);

export default router;
