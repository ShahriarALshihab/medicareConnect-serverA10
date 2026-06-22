import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin, verifyDoctor, verifyPatient } from "../middleware/verifyRole.js";
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentById,
  getAllAppointmentsAdmin,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", verifyToken, verifyPatient, createAppointment);
router.get("/patient/:email", verifyToken, getPatientAppointments);
router.get("/doctor/:email", verifyToken, getDoctorAppointments);
router.get("/admin/all", verifyToken, verifyAdmin, getAllAppointmentsAdmin);
router.get("/:id", verifyToken, getAppointmentById);
router.patch("/reschedule/:id", verifyToken, verifyPatient, rescheduleAppointment);
router.patch("/cancel/:id", verifyToken, verifyPatient, cancelAppointment);
router.patch("/status/:id", verifyToken, verifyDoctor, updateAppointmentStatus);

export default router;
