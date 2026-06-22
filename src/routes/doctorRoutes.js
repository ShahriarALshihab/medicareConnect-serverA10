import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin, verifyDoctor } from "../middleware/verifyRole.js";
import {
  getDoctors,
  getFeaturedDoctors,
  getDoctorById,
  getDoctorByEmail,
  updateDoctorProfile,
  addSchedule,
  updateSchedule,
  removeSchedule,
  getAllDoctorsAdmin,
  updateVerificationStatus,
} from "../controllers/doctorController.js";

const router = express.Router();


router.get("/featured", getFeaturedDoctors);
router.get("/", getDoctors); 
router.get("/:id", getDoctorById);


router.get("/admin/all", verifyToken, verifyAdmin, getAllDoctorsAdmin);
router.patch("/verify/:id", verifyToken, verifyAdmin, updateVerificationStatus);


router.get("/profile/:email", verifyToken, getDoctorByEmail);
router.patch("/profile/:email", verifyToken, verifyDoctor, updateDoctorProfile);
router.post("/schedule/:email", verifyToken, verifyDoctor, addSchedule);
router.patch("/schedule/:email/:day", verifyToken, verifyDoctor, updateSchedule);
router.delete("/schedule/:email/:day", verifyToken, verifyDoctor, removeSchedule);

export default router;
