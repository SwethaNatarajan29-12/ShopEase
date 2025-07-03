import express from "express";
import { validateUser } from "../middleware/validateUser.js";
import { getProfile, login, register } from "../controller/userController.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get profile for logged-in user
router.get("/profile", validateUser, getProfile);

// Update profile for logged-in user
router.put("/profile", validateUser, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: "User not found" });
    // Update only fields sent by frontend
    const { username, email, mobile, image } = req.body;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (image !== undefined) user.image = image;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  // Clear the auth cookie (adjust name if needed)
  res.clearCookie("x-ecom-jwt", { path: "/", httpOnly: true, sameSite: "lax" });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
