import express from "express";
import { validateUser } from "../middleware/validateUser.js";
import { getProfile, login, logout, register, updateProfile } from "../controller/userController.js";
import { validateLogin, validateSignUp } from "../schema/payloadSchema.js";

const router = express.Router();

// Register
router.post("/register", validateSignUp, register);

// Login
router.post("/login", validateLogin,login);

// Get profile for logged-in user
router.get("/profile", validateUser, getProfile);

// Update profile for logged-in user
router.put("/profile", validateUser, updateProfile);

// Logout user
router.post("/logout", validateUser, logout);

export default router;
