import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String,
  phone: String,
  altPhone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  pincode: String,
  identityId: { type: String, required: true },
  type: { type: String, enum: ["home", "work"], default: "home" },
});

export default mongoose.model("Address", addressSchema);
