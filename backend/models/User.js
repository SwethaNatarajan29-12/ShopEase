import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  mobile: { type: String },
  image: { type: String },
  identityId: { type: String, required: true, unique: true },
}, {
  timestamps: true
});

const User =  mongoose.model("User", userSchema);

export {User};
