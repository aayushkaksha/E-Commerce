import express from "express";
import { getCart, addToCart, removeFromCart } from "../controller/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js"
const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/", protect, removeFromCart);

export default router;
