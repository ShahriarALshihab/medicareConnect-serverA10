import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    diagnosis: { type: String, required: true },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    notes: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: true } }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
