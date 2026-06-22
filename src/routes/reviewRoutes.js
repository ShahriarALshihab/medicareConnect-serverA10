import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyPatient } from "../middleware/verifyRole.js";
import {
  createReview,
  getPatientReviews,
  getDoctorReviews,
  getRecentReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/recent", getRecentReviews);
router.get("/doctor/:doctorId", getDoctorReviews);

router.post("/", verifyToken, verifyPatient, createReview);
router.get("/patient/:email", verifyToken, getPatientReviews);
router.patch("/:id", verifyToken, verifyPatient, updateReview);
router.delete("/:id", verifyToken, verifyPatient, deleteReview);

export default router;
