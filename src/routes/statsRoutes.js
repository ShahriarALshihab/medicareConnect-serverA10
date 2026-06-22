import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyRole.js";
import {
  getPlatformStats,
  getPatientStats,
  getDoctorStats,
  getAdminStats,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/platform", getPlatformStats); 
router.get("/patient/:email", verifyToken, getPatientStats);
router.get("/doctor/:email", verifyToken, getDoctorStats);
router.get("/admin", verifyToken, verifyAdmin, getAdminStats);

export default router;
