import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { initFirebaseAdmin } from "./src/config/firebaseAdmin.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import prescriptionRoutes from "./src/routes/prescriptionRoutes.js";
import statsRoutes from "./src/routes/statsRoutes.js";

dotenv.config();
initFirebaseAdmin();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MediCare Connect API is running ✅");
});

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payments", paymentRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Something went wrong on the server" });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(` MediCare Connect server running on port ${port}`);
  });
});
