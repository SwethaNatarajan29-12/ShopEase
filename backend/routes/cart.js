import express from "express";
import { addOrUpdateCartItem, clearCart, getCart, removeCartItem } from "../controller/cartController.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

// Get user's cart
router.get("/:userId", validateUser, getCart);

// Add/update cart item
router.post("/:userId", validateUser, addOrUpdateCartItem);

// Remove item
router.delete("/:userId/:productId", validateUser, removeCartItem);

// Clear cart
router.delete("/:userId", validateUser, clearCart);

export default router;
