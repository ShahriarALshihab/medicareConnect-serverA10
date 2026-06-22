import express from "express";
import { issueJWT, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/jwt", issueJWT);
router.post("/users", registerUser);

export default router;
