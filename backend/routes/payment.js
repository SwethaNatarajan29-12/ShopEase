import express from "express";
import { makePayment } from "../controller/paymentController.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();


// Create Stripe payment intent
router.post("/create-payment-intent", validateUser, makePayment);

export default router;
