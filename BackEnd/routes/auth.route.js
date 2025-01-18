import express from "express";
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
} from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", registerUser); // User Registration
router.post("/login", loginUser);     // User Login

// Protected routes
router.get("/profile", protect, getUserProfile); // Profile for any authenticated user

// Admin-only route
router.get("/seller", protect, authorizeRoles("admin"), getUserProfile);

export default router;
