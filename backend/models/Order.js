import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  description: String,
  category: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["stripe", "cod"], required: true },
  status: { type: String, default: "placed" },
  createdAt: { type: Date, default: Date.now },
  address: { type: String }, // Optionally store shipping address
  identityId: { type: String, required: true, unique: true }, // Unique identifier for the order
});

export default mongoose.model("Order", orderSchema);
