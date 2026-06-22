import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientEmail: { type: String, required: true },
    patientName: { type: String, required: true },
    patientPhoto: { type: String, default: "" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: true } }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
