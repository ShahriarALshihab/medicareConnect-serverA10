import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    photo: { type: String, default: "" },
    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

const User = mongoose.model("User", userSchema);
export default User;
