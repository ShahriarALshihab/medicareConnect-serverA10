import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    times: [{ type: String, required: true }],
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, unique: true }, // links to Users collection
    doctorName: { type: String, required: true },
    specialization: { type: String, required: true },
    qualifications: { type: String, default: "" },
    experience: { type: Number, default: 0 }, // years
    consultationFee: { type: Number, required: true },
    hospitalName: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    availableSlots: [slotSchema],
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

doctorSchema.index({ doctorName: "text", specialization: "text" });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
