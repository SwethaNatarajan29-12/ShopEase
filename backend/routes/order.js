import express from "express";
import { placeOrder, getOrders } from "../controller/orderController.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

// Place a new order
router.post("/", validateUser, placeOrder);

// Get all orders for a user
router.get("/:userId", validateUser, getOrders);

export default router;
