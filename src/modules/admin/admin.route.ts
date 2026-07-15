import { Router } from "express";
import auth from "../../middleware/auth";
import { AdminControllers } from "./admin.controller";

const router = Router();


router.get("/users", auth("ADMIN"), AdminControllers.getAllUsers);


router.patch("/users/:id", auth("ADMIN"), AdminControllers.updateUserStatus);

router.get("/properties", auth("ADMIN"), AdminControllers.getAllProperties);


router.get("/rentals", auth("ADMIN"), AdminControllers.getAllRentalRequests);

export const AdminRoutes = router;