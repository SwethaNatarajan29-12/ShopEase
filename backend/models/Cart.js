import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  name: { type: String },
  description: { type: String },
  category: { type: String },
  price: { type: Number },
  image: { type: String }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
 // Optional field to mark item as active or inactive
});

export default mongoose.model("Cart", cartSchema);
