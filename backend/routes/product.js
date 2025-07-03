import express from "express";
import { createProduct, getAllProducts } from "../controller/productController.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

// Get all products
router.get("/", validateUser,getAllProducts);

// Add product (admin/demo)
router.post("/", validateUser, createProduct);

export default router;
