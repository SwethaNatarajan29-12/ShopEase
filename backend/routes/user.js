import express from "express";
import { validateUser } from "../middleware/validateUser.js";
import { getProfile, login, logout, register, updateProfile } from "../controller/userController.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get profile for logged-in user
router.get("/profile", validateUser, getProfile);

// Update profile for logged-in user
router.put("/profile", validateUser, updateProfile);

// Logout
router.post("/logout", validateUser, logout);

export default router;
