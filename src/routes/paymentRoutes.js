import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyRole.js";
import {
  createPaymentIntent,
  recordPayment,
  getPatientPayments,
  getAllPaymentsAdmin,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/", verifyToken, recordPayment);
router.get("/patient/:email", verifyToken, getPatientPayments);
router.get("/admin/all", verifyToken, verifyAdmin, getAllPaymentsAdmin);

export default router;
