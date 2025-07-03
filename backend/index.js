import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/order.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(cors({
  origin: [
    'http://localhost:3001', // React dev
    'http://localhost:5173', // Vite dev
    'http://127.0.0.1:5173',
    'http://localhost:5001'
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);



const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/(.*)/, (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("MongoDB connected successfully", MONGO_URI);
  })
  .catch((err) => console.error("MongoDB connection error:", err));
