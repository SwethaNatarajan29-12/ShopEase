import express from "express";
import Address from "../models/Address.js";
import { validateUser } from "../middleware/validateUser.js";
import { addAddress, deleteAddress, getAllAddress, updateAddress } from "../controller/addressController.js";

const router = express.Router();

// Get all addresses for user
router.get("/", validateUser, getAllAddress);

// Add address
router.post("/", validateUser, addAddress);

// Update address
router.put("/:id", validateUser, updateAddress);

// Delete address
router.delete("/:userId/:addressId", validateUser, deleteAddress);

export default router;
